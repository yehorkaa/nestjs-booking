import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_S3_REGION,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  cloudfrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN,
  cloudfrontDistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
}));