import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import jwtUserConfig from '../auth/config/jwt-user.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtUserConfig.asProvider()),
    ConfigModule.forFeature(jwtUserConfig),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
