import {
  CloudFrontClient,
  CreateInvalidationCommand,
  CreateInvalidationCommandInput,
} from '@aws-sdk/client-cloudfront';
import { Inject, Injectable } from '@nestjs/common';
import awsConfig from '../config/aws.config';
import { ConfigType } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { ensureLeadingPrefix } from '@nestjs-booking-clone/common';

@Injectable()
export class AwsCloudfrontService {
  constructor(
    @Inject(CloudFrontClient)
    private readonly cloudfront: CloudFrontClient,
    @Inject(awsConfig.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsConfig>
  ) {}

  async invalidate(
    filesKeys: CreateInvalidationCommandInput['InvalidationBatch']['Paths']['Items']
  ) {
    const normalizedKeys = filesKeys.map(key => ensureLeadingPrefix(key));
    
    const command = new CreateInvalidationCommand({
      DistributionId: this.awsConfiguration.cloudfrontDistributionId,
      InvalidationBatch: {
        CallerReference: uuidv4(),
        Paths: {
          Quantity: normalizedKeys.length,
          Items: normalizedKeys,
        },
      },
    });
    const response = await this.cloudfront.send(command);
    return response;
  }
}
