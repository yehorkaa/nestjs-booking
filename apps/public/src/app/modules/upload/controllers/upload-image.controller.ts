import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Delete,
  Put,
} from '@nestjs/common';
import { UploadImageService } from '../services/upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AUTH_TYPE, MulterFile } from '@nestjs-booking-clone/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import {
  UPLOAD_IMAGE_FILE_TYPE,
  UPLOAD_IMAGE_MAX_FILE_SIZE,
} from '../upload.const';

@Auth(AUTH_TYPE.NONE) // TODO: Remove this after testing and in final version
@Controller('upload/image')
export class UploadImageController {
  constructor(private readonly uploadService: UploadImageService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: UPLOAD_IMAGE_FILE_TYPE }),
          new MaxFileSizeValidator({ maxSize: UPLOAD_IMAGE_MAX_FILE_SIZE }),
        ],
      })
    )
    file: MulterFile
  ) {
    const { url, key } = await this.uploadService.uploadImage(file);
    return { url, key };
  }

  @Delete(':fileKey')
  async delete(@Param('fileKey') fileKey: string) {
    const { key } = await this.uploadService.deleteImage(fileKey);
    return { key };
  }

  @Put(':fileKey')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('fileKey') fileKey: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: UPLOAD_IMAGE_FILE_TYPE }),
          new MaxFileSizeValidator({ maxSize: UPLOAD_IMAGE_MAX_FILE_SIZE }),
        ],
      })
    )
    file: MulterFile
  ) {
    const { url, key } = await this.uploadService.updateImage(fileKey, file);
    return { url, key };
  }
}
