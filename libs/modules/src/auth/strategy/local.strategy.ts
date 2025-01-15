import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { IActiveUserData } from '../interface/active-user-data.interface';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(req: Request): Promise<IActiveUserData> {
    const res = await this.authService.validateUser(
      req.body.email as string,
      req.body.password as string,
    );

    if (!res) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user: IActiveUserData = {
      id: res.id,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      role: res.userRole,
    };

    return user;
  }
}
