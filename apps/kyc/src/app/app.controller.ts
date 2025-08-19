import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ActiveUser,
  ActiveUserModel,
} from './modules/auth/decorators/active-user.decorator';
import { UserRoles } from './modules/auth/decorators/user-role.decorator';
import {
  AUTH_TYPE,
  MulterFile,
  PUBLIC_USER_ROLES,
} from '@nestjs-booking-clone/common';
import { UserRoleGuard } from './modules/auth/guards/user-role.guard';
import { RequestPropertyOwnerDto } from './dto/request-property-owner.dto';
import { Auth } from './modules/auth/decorators/auth.decorator';
import { ParseFilePipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  private static readonly PASSPORT_FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly PASSPORT_FILE_TYPE = /(pdf|doc|docx)$/;

  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('users')
  @Auth(AUTH_TYPE.NONE)
  async findAllUsers() {
    return this.appService.findAllUsers();
  }

  @Post('roles/property-owner')
  @UserRoles(PUBLIC_USER_ROLES.TENANT) // Roles that we allow to send request
  @UseGuards(UserRoleGuard)
  @UseInterceptors(FileInterceptor('passportFile'))
  async requestPropertyOwnerRole(
    @ActiveUser() user: ActiveUserModel,
    @Body() dto: RequestPropertyOwnerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: AppController.PASSPORT_FILE_TYPE }),
          new MaxFileSizeValidator({
            maxSize: AppController.PASSPORT_FILE_MAX_SIZE,
          }),
        ],
      })
    )
    passportFile: MulterFile
  ) {
    return this.appService.requestPropertyOwnerRole(user, dto, passportFile);
  }

  @Delete('users')
  @Auth(AUTH_TYPE.NONE)
  async deleteAllUsers() {
    return this.appService.deleteAllUsers();
  }
}
