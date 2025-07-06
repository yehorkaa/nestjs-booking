import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsS3Service } from '../../aws/services/aws-s3.service';
import { MulterFile } from '@nestjs-booking-clone/common';
import { v4 as uuidv4 } from 'uuid';
import { AwsCloudfrontService } from '../../aws/services/aws-cloudfront.service';

@Injectable()
export class UploadImageService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly awsCloudfrontService: AwsCloudfrontService
  ) {}

  private readonly AWS_S3_PREFIX = 'images/';

  async uploadImage(file: MulterFile) {
    try {
      const fileKey = uuidv4();
      const awsS3Key = this.getImageAwsS3Key(fileKey);
      await this.awsS3Service.upload(awsS3Key, file.buffer, {
        ContentType: file.mimetype,
      });
      return { url: this.getImageUrl(fileKey), key: fileKey };
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }

  async deleteImage(fileKey: string) {
    try {
      const awsS3Key = this.getImageAwsS3Key(fileKey);
      await this.awsS3Service.delete(awsS3Key);
      await this.awsCloudfrontService.invalidate([awsS3Key]);
      return { key: fileKey };
    } catch (error) {
      throw new BadRequestException('Failed to delete image');
    }
  }

  async updateImage(fileKey: string, file: MulterFile) {
    try {
      const awsS3Key = this.getImageAwsS3Key(fileKey);
      await this.awsS3Service.upload(awsS3Key, file.buffer, {
        ContentType: file.mimetype,
      });
      await this.awsCloudfrontService.invalidate([awsS3Key]);
      return { url: this.getImageUrl(fileKey), key: fileKey };
    } catch (error) {
      throw new BadRequestException('Failed to update image');
    }
  }

  private getImageUrl(fileKey: string) {
    return this.awsS3Service.getPublicUrl(this.getImageAwsS3Key(fileKey));
  }

  private getImageAwsS3Key(fileKey: string) {
    return `${this.AWS_S3_PREFIX}${fileKey}`;
  }
}
