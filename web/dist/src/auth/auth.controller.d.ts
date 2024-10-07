import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<any>;
}
