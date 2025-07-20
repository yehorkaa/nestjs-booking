import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User } from '../user/entities/user.entity';
import { PG_ERROR_CODES } from 'packages/common/src/const/pg-codes.const';
import { MulterFile } from '@nestjs-booking-clone/common';
import { UploadImageService } from '../upload/services/upload-image.service';
import { UserProfile } from './entities/user-profile.entity';
import { UserProfileAvatar } from './entities/user-profile-avatar.entity';
import { TransactionHelper } from '../../helpers/transaction.helper';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    private readonly uploadImageService: UploadImageService,
    private readonly transactionHelper: TransactionHelper
  ) {}

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'profile.avatars'],
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    try {
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

  async uploadUserProfileAvatar(userId: string, avatar: MulterFile) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    const { url: newAvatarUrl, key: newAvatarKey } =
      await this.uploadImageService.uploadImage(avatar);

    if (!newAvatarUrl || !newAvatarKey) {
      throw new InternalServerErrorException('Failed to upload avatar');
    }
    const queryRunner = await this.transactionHelper.start();
    try {
      const userProfileAvatarRepo =
        queryRunner.manager.getRepository(UserProfileAvatar);
      await userProfileAvatarRepo.update(
        {
          userProfile: { id: userProfile.id },
        },
        {
          isMain: false, // We are making all the avatars non-main like in Telegram when you upload new avatar and new one becomes main
        }
      );
      const newAvatar = userProfileAvatarRepo.create({
        url: newAvatarUrl,
        key: newAvatarKey,
        isMain: true,
        userProfile: { id: userProfile.id },
      });
      const { id, url, key, isMain } = await userProfileAvatarRepo.save(
        newAvatar
      );
      await queryRunner.commitTransaction();
      return {
        id,
        url,
        key,
        isMain,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (newAvatarKey && newAvatarUrl) {
        await this.uploadImageService.deleteImage(newAvatarKey);
      }
      throw new InternalServerErrorException('Failed to upload avatar');
    } finally {
      await queryRunner.release();
    }
  }

  async makeAvatarMain(avatarId: string, userId: string) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    const queryRunner = await this.transactionHelper.start();
    try {
      const userProfileAvatarRepo =
        queryRunner.manager.getRepository(UserProfileAvatar);
      await userProfileAvatarRepo.update(
        { userProfile: { id: userProfile.id } },
        { isMain: false }
      );
      const updatedMainAvatar = await userProfileAvatarRepo.update(
        { id: avatarId, userProfile: { id: userProfile.id } },
        { isMain: true }
      );

      if (updatedMainAvatar.affected !== 1) {
        // additional check to make sure that the avatar is found and owned by the user
        throw new Error('Avatar not found or not owned by user');
      }
      await queryRunner.commitTransaction();
      return {
        id: avatarId,
      };
    } catch (e) {
      const errorMessage = e?.message;
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(errorMessage);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAvatar(avatarId: string, userId: string) {
    const userProfile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!userProfile) {
      throw new NotFoundException('User profile not found');
    }

    const queryRunner = await this.transactionHelper.start();

    try {
      const userProfileAvatarRepo =
        queryRunner.manager.getRepository(UserProfileAvatar);

      const targetAvatar = await userProfileAvatarRepo.findOne({
        where: {
          id: avatarId,
          userProfile: { id: userProfile.id },
        },
      });

      if (!targetAvatar) {
        throw new Error('Avatar not found or not owned by user');
      }

      await userProfileAvatarRepo.delete({ id: targetAvatar.id });

      if (targetAvatar.isMain) {
        const latestAvatar = await userProfileAvatarRepo.findOne({
          where: {
            userProfile: { id: userProfile.id },
          },
          order: { updatedAt: 'DESC' },
        });

        if (latestAvatar) {
          await userProfileAvatarRepo.update(
            { id: latestAvatar.id },
            { isMain: true }
          );
          await queryRunner.commitTransaction();
          return { id: targetAvatar.id };
        }
        await queryRunner.commitTransaction();
        return { id: targetAvatar.id };
      }
      await this.uploadImageService.deleteImage(targetAvatar.key);
      await queryRunner.commitTransaction();
      return { id: targetAvatar.id };
    } catch (e) {
      const errorMessage = e?.message;
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(errorMessage);
    } finally {
      await queryRunner.release();
    }
  }
}
