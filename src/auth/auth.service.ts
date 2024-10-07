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

  async signUp({ name, email, code, password1, password2 }: SignUpDto) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      throw new ConflictException('Email already in use');
    }
    await this.mailService.verifyCode(email, code);
    this.comparePasswords(password1, password2);
    return await this.userService.create(name, email, password1);
  }

  private comparePasswords(password1: string, password2: string) {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }
}
