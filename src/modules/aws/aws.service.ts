import { randomUUID } from 'node:crypto';
import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AWSConfig, Config } from '../../configs/configs.type';
import { LoggerService } from '../logger/logger.service';
import { FileTypeEnum } from './models/enums/file-type.enum';

@Injectable()
export class AwsService {
  private awsConfig: AWSConfig;
  private readonly client: S3Client;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.awsConfig = this.configService.get<AWSConfig>('aws');

    const configuration: S3ClientConfig = {
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
      },
      region: this.awsConfig.region,
    };

    const endpoint = this.awsConfig.endpoint;
    if (endpoint) {
      configuration.endpoint = endpoint;
      configuration.forcePathStyle = true;
    }

    this.client = new S3Client(configuration);
  }

  public async uploadFile(
    file: Express.Multer.File,
    itemType: FileTypeEnum,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.originalname);
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );
      return filePath;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async uploadFiles(
    files: Express.Multer.File[],
    itemType: FileTypeEnum,
    itemId: string,
  ): Promise<string[]> {
    const uploadFiles = files.map((file) =>
      this.uploadFile(file, itemType, itemId),
    );
    return await Promise.all(uploadFiles);
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.awsConfig.bucketName,
          Key: filePath,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private buildPath(
    itemType: FileTypeEnum,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
  }
}
