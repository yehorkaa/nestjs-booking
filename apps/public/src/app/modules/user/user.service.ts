import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository.find({ 
      relations: ['profile', 'profile.avatars']
    });
    return users;
  }

  async deleteById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    const deletedUser = await this.userRepository.remove(user);
    return deletedUser;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'profile.avatars']
    });
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }
}
