import { SendVerificationDto } from './dto/send-verification.dto';
import { MailService } from './mail.service';
export declare class MailController {
    private readonly mailService;
    constructor(mailService: MailService);
    sendVerification(sendVerificationDto: SendVerificationDto): Promise<void>;
}
