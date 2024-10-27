import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const playload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(playload),
    };
  }

  async signUp({ email, verificationCode, password }: SignUpDto) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already in use');
    }
    await this.mailService.verifyCode(email, verificationCode);
    return await this.userService.create({ name: 'nickname', email, password });
  }

  async resetPassword({
    email,
    password,
    verificationCode: code,
  }: ResetPasswordDto) {
    await this.mailService.verifyCode(email, code);
    await this.userService.resetPassword(email, password);
  }
}
