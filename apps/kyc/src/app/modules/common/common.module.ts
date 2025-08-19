import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import jwtUserConfig from '../auth/config/jwt-user.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtUserConfig.asProvider()),
    ConfigModule.forFeature(jwtUserConfig),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
  exports: [AccessTokenGuard],
})
export class CommonModule {}
