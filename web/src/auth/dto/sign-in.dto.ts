import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class SignInDto {
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
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
