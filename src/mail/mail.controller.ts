import { Body, Controller, Post } from '@nestjs/common';
import { SendVerificationDto } from './dto/send-verification.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('send-verification')
    async sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
        const mailVerification = await this.mailService.createMailVerification(sendVerificationDto.email);
        this.mailService.sendVerificationCode(mailVerification);
    }
}
