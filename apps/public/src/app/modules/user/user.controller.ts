import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserModel } from '../auth/decorators/active-user.decorator';
import { AUTH_TYPE } from '@nestjs-booking-clone/common';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Auth(AUTH_TYPE.NONE)
  async findAll(@ActiveUser() activeUser: ActiveUserModel) {
    const response = await this.userService.findAll();
    return response;
  }

  @Delete('all')
  @Auth(AUTH_TYPE.NONE)
  async deleteAll() {
    const response = await this.userService.deleteAll();
    return response;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const response = await this.userService.deleteById(id);
    return response;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const response = await this.userService.findById(id);
    return response;
  }
}
