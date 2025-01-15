import { ManagerModule } from 'libs/manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';

import { SeedService } from './seed.service';
import { UserInstallerService } from './services/user-installer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/seeder/.env',
    }),
    ManagerModule,
    CommandModule,
  ],
  providers: [SeedService, UserInstallerService],
})
export class SeedModule {}
