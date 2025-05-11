import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { BCRYPT_SERVICE } from './common.const';

@Module({
  providers: [
    {
      provide: BCRYPT_SERVICE,
      useClass: BcryptService,
    },
  ],
})
export class CommonModule {}
