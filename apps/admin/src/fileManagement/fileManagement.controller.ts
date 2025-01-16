import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IS3Service } from '@app/manager/s3/s3.service';
import { JwtAuthGuard } from '@app/modules/auth/guard/jwt-auth.guard';
import { IsPublic } from 'libs/building-block/Decorators/isPublic';

@ApiTags('Files') // Swagger tag for grouping
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: IS3Service) {}

  @Post('upload-url/:lectureId')
  @ApiOperation({ summary: 'Generate an upload URL for a file' })
  @ApiParam({
    name: 'lectureId',
    description: 'UUID of the lecture to associate the file with',
    type: String,
  })
  @ApiBody({
    description: 'Payload containing fileName and fileType',
    schema: {
      type: 'object',
      properties: {
        fileName: {
          type: 'string',
          description: 'Name of the file to be uploaded',
          example: 'example.pdf',
        },
        fileType: {
          type: 'string',
          description: 'MIME type of the file to be uploaded',
          example: 'application/pdf',
        },
      },
      required: ['fileName', 'fileType'],
    },
  })
  @IsPublic()
  async getUploadUrl(
    @Param('lectureId', ParseUUIDPipe) lectureId: string,
    @Body() body: { fileName: string; fileType: string },
  ) {
    return await this.fileService.generateUploadUrl(
      lectureId,
      body.fileName,
      body.fileType,
    );
  }

  @Get('download-url/:fileId')
  @ApiOperation({ summary: 'Generate a download URL for a file' })
  @ApiParam({
    name: 'fileId',
    description: 'UUID of the file to download',
    type: String,
  })
  async getDownloadUrl(@Param('fileId', ParseUUIDPipe) fileId: string) {
    return await this.fileService.generateDownloadUrl(fileId);
  }

  @Delete(':fileId')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({
    name: 'fileId',
    description: 'UUID of the file to be deleted',
    type: String,
  })
  async deleteFile(@Param('fileId', ParseUUIDPipe) fileId: string) {
    await this.fileService.deleteFile(fileId);
    return { message: 'File deleted successfully' };
  }
}
