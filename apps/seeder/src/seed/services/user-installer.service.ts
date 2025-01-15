import { IUserService } from 'libs/manager/services/user/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from 'libs/building-block/RequestableDTOs';

@Injectable()
export class UserInstallerService {
  constructor(private userService: IUserService) {}
  async seedAdminUsers(users: CreateUserDto[]) {
    try {
      for (const user of users) {
        const _user = await this.userService.getUserByEmail(user.email);

        if (!_user) {
          const newCreatedUser = await this.userService.create(user, undefined);
          Logger.log(`[-] User created with email : ${newCreatedUser.email}`);
        }
      }
    } catch (err) {
      Logger.error('[-] Error in seeding users!', err.message);
      Logger.error('[-] Error in seeding users!', err);
    }
  }
}
