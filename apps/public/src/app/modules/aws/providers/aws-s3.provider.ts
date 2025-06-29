import { S3Client } from '@aws-sdk/client-s3';
import { Provider, Scope } from '@nestjs/common';
import awsS3Config from '../config/aws.config';
import { ConfigType } from '@nestjs/config';

export const AwsS3ClientProvider: Provider<S3Client> = {
  provide: S3Client,
  useFactory: (awsS3Configuration: ConfigType<typeof awsS3Config>) => {
    return new S3Client({
      region: awsS3Configuration.region,
      credentials: {
        accessKeyId: awsS3Configuration.accessKeyId,
        secretAccessKey: awsS3Configuration.secretAccessKey,
      },
    });
  },
  scope: Scope.DEFAULT, // default scope is singleton, so it will be created only once when app is loaded
  inject: [awsS3Config.KEY],
};
