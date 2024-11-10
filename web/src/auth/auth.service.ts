import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { MailService } from '../mail/mail.service';
import * as schema from '../drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';
import { ForbiddenException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import { Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id, email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signUp(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already in use');
    }
    this.sendActivateToken(email, password);
  }

  async sendActivateToken(email: string, password: string) {
    const payload = { email, password } as SignUpDto;
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACTIVATE_TOKEN_SECRET_KEY'),
      expiresIn: '2h',
    });
    this.mailService.send({
      to: email,
      subject: '激活账号',
      htmlBody: `您的激活链接是：${this.configService.get('WEB_DOMAIN')}/activate/${token}`,
    });
  }

  async activateToken(token: string) {
    let payload: SignUpDto;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACTIVATE_TOKEN_SECRET_KEY'),
      }) as SignUpDto;
    } catch (error) {
      this.logger.debug(error);
      throw new BadRequestException('Invalid token');
    }
    const { email, password } = payload;
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already in use');
    }
    await this.userService.create({
      name: email.split('@')[0],
      email,
      password,
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.db.query.user.findFirst({
      where: eq(schema.user.id, userId),
    });
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access denied');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshTokenHash,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }
    const tokens = await this.generateTokens(user.id, user.email || '');
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async resetPassword({
    email,
    password,
    verificationCode: code,
  }: ResetPasswordDto) {
    await this.mailService.verifyCode(email, code);
    await this.userService.resetPassword(email, password);
  }

  async generateTokens(userId: number, email: string): Promise<Tokens> {
    const payload = { sub: userId, email: email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: '2h',
      }),
      this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    await this.userService.findOne(userId);
    const refreshTokenHash = await argon2.hash(refreshToken);

    await this.db
      .update(schema.user)
      .set({ refreshTokenHash })
      .where(eq(schema.user.id, userId))
      .execute();
  }
}
