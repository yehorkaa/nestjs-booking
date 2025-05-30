import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfile } from './entities/user-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  controllers: [UserProfileController],
  providers: [UserProfileService],
})
export class UserProfileModule {}
