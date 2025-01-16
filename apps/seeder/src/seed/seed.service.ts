import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';

import { UserInstallerService } from './services/user-installer.service';
import { AdminUsersData } from 'libs/building-block/InstallerData/user-installer-data';

@Injectable()
export class SeedService {
  constructor(private readonly userInstallerService: UserInstallerService) {}
  @Command({
    command: 'run:seed-admin-users',
    describe: 'you can use this command to seed database',
  })
  async seed() {
    await this.userInstallerService.seedAdminUsers(AdmsinUsersData);
  }
}
