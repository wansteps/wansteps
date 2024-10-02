import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";
import { PasswordsDto } from "./passwords.dto";

export class resetPasswordDto extends PasswordsDto {
    @ApiProperty({
        description: 'The user email',
        example: 'example@gmail.com',
        minLength: 5,
        maxLength: 255,
        type: String,
    })
    @IsString()
    @IsEmail()
    @Length(5, 255)
    email!: string;

    @IsString()
    @Length(6, 6)
    code!: string;
}