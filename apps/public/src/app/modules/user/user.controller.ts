import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../auth/decorators/user-role.decorator';
import { USER_ROLES } from './user.const';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserModel } from '../auth/decorators/active-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { AUTH_TYPE } from '@nestjs-booking-clone/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(UserRoleGuard)
  @UserRole(USER_ROLES.TENANT, USER_ROLES.PROPERTY_OWNER)
  async findAll(@ActiveUser() activeUser: ActiveUserModel) {
    console.log('activeUser', activeUser);
    const response = await this.userService.findAll();
    return response;
  }

  @Auth(AUTH_TYPE.NONE)
  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    const response = await this.userService.deleteById(id);
    return response;
  }
}
