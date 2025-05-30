import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { BCRYPT_SERVICE } from './const/service.const';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import jwtUserConfig from '../auth/config/jwt-user.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationGuard } from '../auth/guards/authentiocation.guard';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtUserConfig.asProvider()),
    ConfigModule.forFeature(jwtUserConfig),
  ],
  providers: [
    {
      provide: BCRYPT_SERVICE,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard
  ],
  exports: [BCRYPT_SERVICE, AccessTokenGuard]
})
export class CommonModule {}
