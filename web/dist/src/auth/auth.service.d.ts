import { MailService } from 'src/mail/mail.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
export declare class AuthService {
    private readonly userService;
    private readonly mailService;
    constructor(userService: UserService, mailService: MailService);
    signUp({ name, email, code, password1, password2 }: SignUpDto): Promise<any>;
    private comparePasswords;
}
