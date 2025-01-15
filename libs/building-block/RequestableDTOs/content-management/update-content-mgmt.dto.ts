import { CreateContentManagementDtoWithOtherEntites } from './create-content-mgmt.dto';
import { OmitType, PartialType } from '@nestjs/swagger';

export class UpdateContentManagementDto extends PartialType(
  OmitType(CreateContentManagementDtoWithOtherEntites, [
    'ads',
    'videos',
    'sponsors',
    'texts',
  ] as const),
) {}
