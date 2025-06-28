import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AwsS3Service } from '../../aws/aws-s3.service';
import { MulterFile } from '@nestjs-booking-clone/common';
import { v4 as uuidv4 } from 'uuid';
import { getAppBaseUrl } from 'apps/public/src/app/app.const';

@Injectable()
export class UploadImageService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  private readonly AWS_S3_PREFIX = 'images/';

  async getAllImages(limit: number) {
    try {
      const response = await this.awsS3Service.listObjectsV2(
        this.AWS_S3_PREFIX,
        limit
      );
      const imagesContents =
        response.Contents && Array.isArray(response.Contents)
          ? response.Contents
          : [];
      const imagesList = imagesContents.map((image) => {
        const key = image.Key.split('/').pop();
        return this.getImageUrl(key);
      });
      return imagesList;
    } catch (error) {
      throw new BadRequestException('Failed to get all images');
    }
  }

  async getImage(fileKey: string) {
    try {
      const awsS3Key = this.getImageAwsS3Key(fileKey);
      const response = await this.awsS3Service.getFileBuffer(awsS3Key);
      return {
        contentType: response.ContentType,
        buffer: response.Body,
      };
    } catch (error) {
      throw new NotFoundException('Failed to get image');
    }
  }

  async uploadImage(file: MulterFile) {
    try {
      const fileKey = uuidv4();
      const awsS3Key = this.getImageAwsS3Key(fileKey);
      await this.awsS3Service.upload(awsS3Key, file.buffer, {
        ContentType: file.mimetype,
      });
      return this.getImageUrl(fileKey);
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }

  async deleteImage(fileKey: string) {
    try {
      const awsS3Key = this.getImageAwsS3Key(fileKey);
      await this.awsS3Service.delete(awsS3Key);
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
      return this.getImageUrl(fileKey);
    } catch (error) {
      throw new BadRequestException('Failed to update image');
    }
  }

  private getImageUrl(fileKey: string) {
    return `${getAppBaseUrl()}/upload/image/${fileKey}`;
  }

  private getImageAwsS3Key(fileKey: string) {
    return `${this.AWS_S3_PREFIX}${fileKey}`;
  }
}
