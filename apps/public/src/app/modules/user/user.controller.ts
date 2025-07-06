import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async findAll() {
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
