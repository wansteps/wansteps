import { PasswordsDto } from './passwords.dto';
export declare class SignUpDto extends PasswordsDto {
    name: string;
    email: string;
    code: string;
}
