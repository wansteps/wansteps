import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { IMessage } from '../common/interface/message.interface';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { HttpCode } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { getCurrentUser, getCurrentUserId, Public } from './decorators';
import { UseGuards } from '@nestjs/common';
import { RtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Public()
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

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The refresh token has been exchanged for a new access token',
  })
  @ApiForbiddenResponse({
    description: 'Access denied',
  })
  refreshTokens(
    @getCurrentUserId() userId: number,
    @getCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
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
