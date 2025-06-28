import { registerAs } from '@nestjs/config';

export default registerAs('aws-s3', () => ({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
  region: process.env.AWS_S3_REGION,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
}));