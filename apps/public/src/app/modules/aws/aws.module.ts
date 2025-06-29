import { Module } from '@nestjs/common';
import { AwsS3Service } from './services/aws-s3.service';
import awsConfig from './config/aws.config';
import { ConfigModule } from '@nestjs/config';
import { AwsS3ClientProvider } from './providers/aws-s3.provider';
import { AwsCloudfrontClientProvider } from './providers/aws-cloudfront.provider';
import { AwsCloudfrontService } from './services/aws-cloudfront.service';

@Module({
  imports: [ConfigModule.forFeature(awsConfig)],
  controllers: [],
  providers: [
    AwsS3Service,
    AwsS3ClientProvider,
    AwsCloudfrontService,
    AwsCloudfrontClientProvider,
  ],
  exports: [AwsS3Service, AwsCloudfrontService],
})
export class AwsModule {}
