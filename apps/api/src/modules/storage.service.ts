import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get('SUPABASE_S3_ENDPOINT'),
      region: this.configService.get('SUPABASE_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('SUPABASE_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow(
          'SUPABASE_S3_SECRET_ACCESS_KEY',
        ),
      },
      forcePathStyle: true,
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    this.bucket = this.configService.getOrThrow(
      'SUPABASE_STORAGE_DEFAULT_BUCKET',
    );
  }

  async uploadFile(
    key: string,
    fileBuffer: Buffer,
    contentType: string,
    bucket = this.bucket,
  ): Promise<string> {
    const safeKey = this.encodeKey(key);
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: safeKey,
        Body: fileBuffer,
        ContentType: contentType,
      });
      await this.s3Client.send(command);
      return safeKey;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file', {
        cause: error,
      });
    }
  }

  async removeFile(key: string, bucket = this.bucket): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: this.encodeKey(key),
      });
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete file', {
        cause: error,
      });
    }
  }

  async getPresignedDownloadUrl(
    key: string,
    expiresInSeconds = 900,
    bucket = this.bucket,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: this.encodeKey(key),
      });
      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate secure download link',
        { cause: error },
      );
    }
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds = 900,
    bucket = this.bucket,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: this.encodeKey(key),
        ContentType: contentType,
      });

      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
        signableHeaders: new Set(['content-type']),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate secure upload link',
        { cause: error },
      );
    }
  }

  private encodeKey(key: string): string {
    return key.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  }
}
