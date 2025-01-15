import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

export function getFileValidator(fileTypes: string[]): PipeTransform {
  return new FileValidator(fileTypes);
}

@Injectable()
export class FileValidator implements PipeTransform {
  private readonly allowedExtensions: string[];

  constructor(readonly fileType: string[]) {
    this.allowedExtensions = fileType;
  }

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) {
      return null;
    }
    const extension = extname(value.originalname);
    if (!this.allowedExtensions.includes(extension)) {
      throw new BadRequestException(`File type ${extension} not supported`);
    }
    return value;
  }
}
