import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { IMessage } from 'src/common/interface/message.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiCreatedResponse({
    description: 'The user has been created',
  })
  @ApiConflictResponse({
    description: 'Email already in use',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<IMessage> {
    await this.authService.signUp(signUpDto);
    return {
      message: 'User created successfully',
    };
  }
}
