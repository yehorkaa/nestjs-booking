import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './modules/auth/decorators/auth.decorator';
import { AUTH_TYPE } from '@nestjs-booking-clone/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth(AUTH_TYPE.NONE)
  getData() {
    return { message: 'Hello FROM PUBLIC API' };
  }
}
