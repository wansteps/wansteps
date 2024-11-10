import { Body, Controller, Post } from '@nestjs/common';
import { SendVerificationDto } from './dto/send-verification.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-verification')
  async sendVerification(@Body() { email }: SendVerificationDto) {
    const mailVerification =
      await this.mailService.createMailVerification(email);
    this.mailService.send({
      to: mailVerification.email,
      subject: '验证码',
      htmlBody: `您的验证码是：${mailVerification.code}`,
    });

    return { success: true };
  }
}
