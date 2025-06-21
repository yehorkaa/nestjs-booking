import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from '../user/entities/user.entity';
import { PG_ERROR_CODES } from 'packages/common/src/const/pg-codes.const';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile'],
      });
  
      if (!user) {
        throw new NotFoundException('User profile not found');
      }
  
      const { phoneNumber, ...userProfileDto } = updateUserProfileDto;
      const updatedUser = await this.userRepository.save({
        ...user,
        phoneNumber,
        profile: {
          ...user.profile,
          ...userProfileDto,
        },
      }); 
      return updatedUser;
    } catch (error) {
      if (error.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new ConflictException('Phone number already exists');
      }
      throw error;
    }
  }
}
