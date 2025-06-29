import { Inject, Injectable } from '@nestjs/common';
import awsS3Config from '../config/aws.config';
import { ConfigType } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
  ListObjectsV2CommandInput,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class AwsS3Service {
  constructor(
    @Inject(awsS3Config.KEY)
    private readonly awsS3Configuration: ConfigType<typeof awsS3Config>,
    @Inject(S3Client)
    private readonly s3: S3Client
  ) {}

  async listObjectsV2(
    prefix: string,
    maxKeys: number = 10,
    rest?: Partial<ListObjectsV2CommandInput>
  ) {
    const command = new ListObjectsV2Command({
      Bucket: this.awsS3Configuration.bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys,
      ...rest,
    });
    const response = await this.s3.send(command);
    return response;
  }

  async getFileBuffer(fileKey: string, rest?: Partial<GetObjectCommandInput>) {
    const command = new GetObjectCommand({
      Bucket: this.awsS3Configuration.bucketName,
      Key: fileKey,
      ...rest,
    });
    const response = await this.s3.send(command);
    return { ...response, Body: response.Body as unknown as Readable };
  }

  async upload(
    fileKey: string,
    fileBuffer: Buffer,
    rest?: Partial<PutObjectCommandInput>
  ) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.awsS3Configuration.bucketName,
        Key: fileKey,
        Body: fileBuffer,
        ...rest,
      })
    );
    return this.getPublicUrl(fileKey);
  }

  getPublicUrl(fileKey: string) {
    return `https://${this.awsS3Configuration.cloudfrontDomain}/${fileKey}`;
  }

  async delete(fileKey: string, rest?: Partial<DeleteObjectCommandInput>) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.awsS3Configuration.bucketName,
        Key: fileKey,
        ...rest,
      })
    );
  }
}
