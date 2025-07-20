import { Inject, Injectable } from '@nestjs/common';
import awsConfig from '../config/aws.config';
import { ConfigType } from '@nestjs/config';
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommandInput,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsConfig>,
    @Inject(S3Client)
    private readonly s3: S3Client
  ) {}

  async upload(
    fileKey: string,
    fileBuffer: Buffer,
    rest?: Partial<PutObjectCommandInput>
  ) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.awsConfiguration.bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ...rest,
      })
    );
    return this.getPublicUrl(fileKey);
  }

  getPublicUrl(fileKey: string) {
    return `https://${this.awsConfiguration.cloudfrontDomain}/${fileKey}`;
  }

  async delete(fileKey: string, rest?: Partial<DeleteObjectCommandInput>) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.awsConfiguration.bucketName,
        Key: fileKey,
        ...rest,
      })
    );
  }
}
