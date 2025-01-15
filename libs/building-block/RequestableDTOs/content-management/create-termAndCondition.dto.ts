import { ApiProperty } from '@nestjs/swagger';

import { IFile } from 'libs/building-block/Interfaces/file.interface';

export class CreateTermAndConditionDto {
  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  file?: IFile;
}
