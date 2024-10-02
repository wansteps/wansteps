import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class SendVerificationDto {
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
    email: string
}