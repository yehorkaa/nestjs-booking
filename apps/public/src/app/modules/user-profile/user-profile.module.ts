import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileAvatar } from './entities/user-profile-avatar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UploadImageService } from '../upload/services/upload-image.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile, User, UserProfileAvatar]),
    AwsModule,
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, UploadImageService],
})
export class UserProfileModule {}
