import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { Provider, Scope } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from '../config/aws.config';

export const AwsCloudfrontClientProvider: Provider<CloudFrontClient> = {
  provide: CloudFrontClient,
  useFactory: (awsConfiguration: ConfigType<typeof awsConfig>) => {
    return new CloudFrontClient({
      region: awsConfiguration.region,
      credentials: {
        accessKeyId: awsConfiguration.accessKeyId,
        secretAccessKey: awsConfiguration.secretAccessKey,
      },
    });
  },
  scope: Scope.DEFAULT,
  inject: [awsConfig.KEY],
};
