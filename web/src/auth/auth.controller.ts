import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { IMessage } from 'src/common/interface/message.interface';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { HttpCode } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

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
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The password has been reset',
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or verification code',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<IMessage> {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      message: 'Password reset successfully',
    };
  }
}
