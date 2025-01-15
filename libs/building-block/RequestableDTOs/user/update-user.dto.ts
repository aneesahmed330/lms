import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDtoWithProfileImage } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDtoWithProfileImage, ['tenant', 'createdby'] as const),
) {}
