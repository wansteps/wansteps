import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async signUp({ email, verificationCode, password }: SignUpDto) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already in use');
    }
    await this.mailService.verifyCode(email, verificationCode);
    return await this.userService.create({ name: 'nickname', email, password });
  }

  private comparePasswords(password1: string, password2: string) {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }
}
