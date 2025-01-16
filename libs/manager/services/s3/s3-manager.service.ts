// file.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { File, Lecture } from 'libs/manager/entities';
import { IS3Service } from './s3.service';
import * as moment from 'moment';

@Injectable()
export class S3ManagerService implements IS3Service {
  private s3: S3;

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(Lecture)
    private lectureRepository: Repository<Lecture>,
  ) {
    console.log(
      '🚀 ~ S3ManagerService ~ process.env.AWS_SECRET_ACCESS_KEY:',
      process.env.AWS_SECRET_ACCESS_KEY,
    );
    console.log(
      '🚀 ~ S3ManagerService ~ process.env.AWS_ACCESS_KEY_ID:',
      process.env.AWS_ACCESS_KEY_ID,
    );
    console.log(
      '🚀 ~ S3ManagerService ~ process.env.AWS_REGION:',
      process.env.AWS_REGION,
    );

    this.s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generateUploadUrl(
    lectureId: string,
    fileName: string,
    fileType: string,
  ) {
    // First check if lecture exists
    const lecture = await this.lectureRepository.findOne({
      where: { id: lectureId },
    });

    if (!lecture) {
      throw new NotFoundException('Lecture not found');
    }

    const fileKey = `lectures/${lectureId}/${uuidv4()}-${fileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Expires: moment().add(6, 'hours').milliseconds(),
      ContentType: fileType,
    };

    try {
      const uploadUrl = this.s3.getSignedUrl('putObject', params);

      // Create file record
      const file = this.fileRepository.create({
        key: fileKey,
        originalName: fileName,
        url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`,
        lecture: lecture,
      });

      await this.fileRepository.save(file);

      return {
        uploadUrl,
        fileKey,
        fileId: file.id,
      };
    } catch (error) {
      console.log('🚀 ~ S3ManagerService ~ error:', error);
      throw new Error(`Failed to generate upload URL: ${error.message}`);
    }
  }

  async generateDownloadUrl(fileId: string) {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.key,
      Expires: 3600, // Download URL expires in 1 hour
    };

    try {
      const downloadUrl = await this.s3.getSignedUrlPromise(
        'getObject',
        params,
      );
      return { downloadUrl };
    } catch (error) {
      throw new Error(`Failed to generate download URL: ${error.message}`);
    }
  }

  async deleteFile(fileId: string) {
    const file = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: file.key,
    };

    try {
      await this.s3.deleteObject(params).promise();
      await this.fileRepository.remove(file);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
