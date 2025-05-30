import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../auth/decorators/user-role.decorator';
import { USER_ROLES } from './user.const';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @UseGuards(AccessTokenGuard, UserRoleGuard)
  @UserRole([USER_ROLES.TENANT, USER_ROLES.PROPERTY_OWNER])
  async findAll() {
    const response = await this.userService.findAll();
    return response;
  }


  @Delete(':id')
  @UseGuards(AccessTokenGuard, UserRoleGuard)
  @UserRole([USER_ROLES.TENANT, USER_ROLES.PROPERTY_OWNER])
  async deleteById(@Param('id') id: string) {
    const response = await this.userService.deleteById(id);
    return response;
  }
}
