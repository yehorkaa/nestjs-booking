import { S3Client } from '@aws-sdk/client-s3';
import { Provider, Scope } from '@nestjs/common';
import awsConfig from '../config/aws.config';
import { ConfigType } from '@nestjs/config';

export const AwsS3ClientProvider: Provider<S3Client> = {
  provide: S3Client,
  useFactory: (awsS3Configuration: ConfigType<typeof awsConfig>) => {
    return new S3Client({
      region: awsS3Configuration.region,
      credentials: {
        accessKeyId: awsS3Configuration.accessKeyId,
        secretAccessKey: awsS3Configuration.secretAccessKey,
      },
    });
  },
  scope: Scope.DEFAULT, // default scope is singleton, so it will be created only once when app is loaded
  inject: [awsConfig.KEY],
};
