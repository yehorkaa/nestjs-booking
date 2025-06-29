import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { Provider, Scope } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsS3Config from '../config/aws.config';

export const AwsCloudfrontClientProvider: Provider<CloudFrontClient> = {
  provide: CloudFrontClient,
  useFactory: (awsS3Configuration: ConfigType<typeof awsS3Config>) => {
    return new CloudFrontClient({
      region: awsS3Configuration.region,
      credentials: {
        accessKeyId: awsS3Configuration.accessKeyId,
        secretAccessKey: awsS3Configuration.secretAccessKey,
      },
    });
  },
  scope: Scope.DEFAULT,
  inject: [awsS3Config.KEY],
};
