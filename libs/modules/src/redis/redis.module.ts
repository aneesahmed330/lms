import { Module } from '@nestjs/common';

import { RefreshTokenIdsStorageService } from './refreshTokenIdsStorage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({})],
  providers: [RefreshTokenIdsStorageService],
  exports: [RefreshTokenIdsStorageService],
})
export class RedisModule {}
