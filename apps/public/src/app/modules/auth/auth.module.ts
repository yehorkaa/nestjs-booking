import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtUserConfig from './config/jwt-user.config';
import { ConfigModule } from '@nestjs/config';
import { TenantAuthController } from './controllers/tenant-auth.controller';
import { PropertyOwnerAuthController } from './controllers/property-owner-auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RefreshTokenIdsStorage } from './storages/refresh-token-ids.storage';
import { OtpStorage } from './storages/otp.storage';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtUserConfig.asProvider()),
    ConfigModule.forFeature(jwtUserConfig),
    CacheModule.register(),
  ],
  controllers: [
    TenantAuthController,
    PropertyOwnerAuthController,
  ],
  providers: [AuthService, RefreshTokenIdsStorage, OtpStorage],
})
export class AuthModule {}
