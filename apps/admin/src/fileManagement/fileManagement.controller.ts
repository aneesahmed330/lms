import {
  Post,
  Query,
  Controller,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
  FileTypeValidator,
  Body,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { IS3Service } from '@app/manager/s3/s3.service';
import { GetUser } from 'libs/building-block/Decorators/getUser';
import { IsPublic } from 'libs/building-block/Decorators/isPublic';

import { SignedUrlDto } from 'libs/building-block/RequestableDTOs/file/signedUrl.dto';

@ApiTags('Files')
@Controller('files')
export class FileManagementController {
  constructor(
    private readonly fileManagementService: IFileManagementService,
    private readonly s3Service: IS3Service,
  ) {}

  @ApiBearerAuth()
  @Post('excel')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        promotionId: {
          type: 'string',
        },
        fileName: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async processUserExcelFile(
    @GetUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() promotion?: { promotionId: string; fileName: string },
  ) {
    return await this.fileManagementService.readFile(
      user.id,
      file,
      promotion.promotionId,
      promotion.fileName,
    );
  }

  @Post('upload')
  @IsPublic()
  async uploadFile(@Body() file: SignedUrlDto) {
    return await this.s3Service.generateUrl(file.fileName, file.mimeType);
  }

  @IsPublic()
  @Post('/getFile')
  async getFile(@Query('fileName') fileName: string) {
    return await this.s3Service.getFile(fileName);
  }
}
