import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import awsS3Config from './config/aws-s3.config';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forFeature(awsS3Config),
  ],
  controllers: [],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}
