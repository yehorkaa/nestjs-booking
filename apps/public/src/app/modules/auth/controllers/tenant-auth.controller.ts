import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { AuthService } from '../auth.service';
import { USER_ROLES } from '../../user/user.const';
import { Auth } from '../decorators/auth.decorator';
import { AUTH_TYPE } from '@nestjs-booking-clone/common';

@Auth(AUTH_TYPE.NONE)
@Controller('auth/user/tenant')
export class TenantAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const response = await this.authService.signUp(signUpDto);
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const accessToken = await this.authService.signIn(signInDto, USER_ROLES.TENANT);
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }
}
