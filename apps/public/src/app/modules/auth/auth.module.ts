import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtUserConfig from './config/jwt-user.config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RefreshTokenIdsStorage } from './storages/refresh-token-ids.storage';
import { OtpStorage } from './storages/otp.storage';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtUserConfig.asProvider()),
    ConfigModule.forFeature(jwtUserConfig),
    CacheModule.register(),
    MessagingModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenIdsStorage, OtpStorage],
})
export class AuthModule {}
