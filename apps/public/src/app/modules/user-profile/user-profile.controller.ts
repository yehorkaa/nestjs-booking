import { Body, Controller, Patch } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { ActiveUserModel } from '../auth/decorators/active-user.decorator';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Patch('update')
  async updateUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @ActiveUser() activeUser: ActiveUserModel
  ) {
    console.log('activeUser', activeUser);
    return this.userProfileService.updateUserProfile(activeUser.sub, updateUserProfileDto);
  }
}
