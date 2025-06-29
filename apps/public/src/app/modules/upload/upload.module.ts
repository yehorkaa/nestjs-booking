import { Module } from '@nestjs/common';
import { UploadImageService } from './services/upload-image.service';
import { UploadImageController } from './controllers/upload-image.controller';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [UploadImageController],
  providers: [UploadImageService],
})
export class UploadModule {}
