import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserModel } from '../auth/decorators/active-user.decorator';
import { MulterFile } from '@nestjs-booking-clone/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  USER_PROFILE_AVATAR_FILE_TYPE,
  USER_PROFILE_AVATAR_MAX_FILE_SIZE,
} from './user-profile.const';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Patch('update')
  async updateUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @ActiveUser() activeUser: ActiveUserModel
  ) {
    return this.userProfileService.updateUserProfile(
      activeUser.sub,
      updateUserProfileDto
    );
  }
  @Post('avatar/upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: USER_PROFILE_AVATAR_FILE_TYPE }),
          new MaxFileSizeValidator({
            maxSize: USER_PROFILE_AVATAR_MAX_FILE_SIZE,
          }),
        ],
      })
    )
    avatar: MulterFile,
    @ActiveUser() activeUser: ActiveUserModel
  ) {
    return this.userProfileService.uploadUserProfileAvatar(
      activeUser.sub,
      avatar
    );
  }

  @Patch('avatar/:avatarId/make-main')
  async makeAvatarMain(
    @Param('avatarId') avatarId: string,
    @ActiveUser() activeUser: ActiveUserModel
  ) {
    return this.userProfileService.makeAvatarMain(avatarId, activeUser.sub);
  }

  @Delete('avatar/:avatarId')
  async deleteAvatar(
    @Param('avatarId') avatarId: string,
    @ActiveUser() activeUser: ActiveUserModel
  ) {
    return this.userProfileService.deleteAvatar(avatarId, activeUser.sub);
  }
}
