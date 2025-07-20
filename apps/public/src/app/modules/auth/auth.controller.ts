import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { AUTH_TYPE } from '@nestjs-booking-clone/common';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LogoutDto } from './dto/log-out.dto';
import {
  ActiveUser,
  ActiveUserModel,
} from './decorators/active-user.decorator';
import { RequestOtpDto } from './dto/request-otp.dto';

@Auth(AUTH_TYPE.NONE)
@Controller('auth/user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Res({ passthrough: true }) response: Response,
    @Body() signUpDto: SignUpDto
  ) {
    const { user, accessToken, refreshToken } = await this.authService.signUp(
      signUpDto
    );
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return { user, refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto
    );
    response.cookie('accessToken', accessToken, {
      secure: true, // only send cookie over https, if for example localhost is not https, then it will not send the cookie
      httpOnly: true, // to protect cookie from XSS attacks, like document.cookie
      sameSite: true, // to prevent CSRF attacks, so it will only send the cookie if the request is coming from the same origin
    });

    return { refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      refreshTokenDto
    );
    response.cookie('accessToken', accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return { refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.requestOtp(requestOtpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Auth(AUTH_TYPE.BEARER)
  async logout(
    @ActiveUser() user: ActiveUserModel,
    @Res({ passthrough: true }) response: Response,
    @Body() logoutDto: LogoutDto
  ) {
    await this.authService.logout(logoutDto, user.sub);
    response.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
  }
}
