import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { IS3Service } from './s3.service';
import { ServiceError } from 'libs/building-block/filters/service-error';
import * as moment from 'moment';

@Injectable()
export class S3ManagerService implements IS3Service {
  private readonly s3Upload: S3;
  private readonly bucketName: string;

  constructor() {
    this.s3Upload = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
      region: 'us-east-1',
    });

    this.bucketName = process.env.AWS_S3_BUCKET || 's3Bucket';
  }

  async generateUrl(
    fileName: string,
    fileType: string,
  ): Promise<{ url: string; key: string }> {
    try {
      const ext = fileType.split('/')[1];
      const randomId = uuidv4();
      const key = `${randomId}.${ext}`;
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: moment().add(6, 'hours').milliseconds(),
        ContentType: fileType,
      };
      const presignedS3Url = this.s3Upload.getSignedUrl('putObject', params);
      return { url: presignedS3Url, key: key };
    } catch (error) {
      throw new ServiceError(
        'S3 Service',
        error.message,
        'Error in generating URL!',
        500,
      );
    }
  }

  async getFile(key: string, hours = 6, expires = true) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      if (!key) {
        return '';
      }

      const url = this.s3Upload.getSignedUrl('getObject', {
        Bucket: params.Bucket,
        Key: params.Key,
        ...(expires && {
          // Convert hours to seconds, since Expires expects seconds
          Expires: hours * 60 * 60,
        }),
      });

      return url;
    } catch (error) {
      throw new ServiceError(
        'S3 Service',
        error.message,
        'Error in getting signed URL!',
        500,
      );
    }
  }

  async uploadFile(file: Buffer, key: string, type?: string) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ...(type && { ContentType: type }),
      };
      return await this.s3Upload.upload(params).promise();
    } catch (error) {
      throw new ServiceError(
        'S3 Service',
        error.message,
        'Error in Uploading File!',
        500,
      );
    }
  }

  async removeFiles(keys: string[]): Promise<void> {
    try {
      if (!keys || keys.length === 0) {
        throw new ServiceError(
          'S3 Service',
          'No keys provided',
          'Error in removing files!',
          400,
        );
      }

      const deleteParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      };

      const result = await this.s3Upload.deleteObjects(deleteParams).promise();

      if (result.Errors && result.Errors.length > 0) {
        throw new ServiceError(
          'S3 Service',
          'Error while removing some files.',
          `Failed to remove some files: ${result.Errors.map((err) => err.Key)}`,
          500,
        );
      }
    } catch (error) {
      throw new ServiceError(
        'S3 Service',
        error.message,
        'Error in removing files!',
        500,
      );
    }
  }
}
