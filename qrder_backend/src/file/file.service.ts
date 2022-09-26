import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const compressedBuffer = await sharp(dataBuffer)
      .webp({ quality: 75 })
      .resize(150, 150, { fit: 'cover' })
      .toBuffer();
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: compressedBuffer,
        ACL: 'public-read',
        Key: `${uuid()}-${filename}`.replace(/\//g, ''),
      })
      .promise();

    return uploadResult.Location;
  }

  async deletePublicFile(imageUrl: string) {
    const filename = imageUrl.split('/').at(-1);
    const s3 = new S3();
    const deleteResult = await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: filename,
      })
      .promise();

    return deleteResult.$response;
  }
}
