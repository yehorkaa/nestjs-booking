import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRoles } from '../../modules/auth/decorators/user-role.decorator';
import { USER_ROLES } from './user.const';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserModel } from '../auth/decorators/active-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UserRoles(USER_ROLES.TENANT, USER_ROLES.PROPERTY_OWNER)
  async findAll(@ActiveUser() activeUser: ActiveUserModel) {
    const response = await this.userService.findAll();
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
