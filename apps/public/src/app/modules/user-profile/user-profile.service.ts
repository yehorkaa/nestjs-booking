import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from '../user/entities/user.entity';

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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { phoneNumber, ...userProfileDto } = updateUserProfileDto;
    return this.userRepository.save({
      ...user,
      phoneNumber,
      profile: {
        ...user.profile,
        ...userProfileDto,
      },
    });
  }
}
