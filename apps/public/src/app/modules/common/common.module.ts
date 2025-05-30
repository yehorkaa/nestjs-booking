import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { BCRYPT_SERVICE } from './const/service.const';

@Module({
  providers: [
    {
      provide: BCRYPT_SERVICE,
      useClass: BcryptService,
    },
  ],
  exports: [BCRYPT_SERVICE]
})
export class CommonModule {}
