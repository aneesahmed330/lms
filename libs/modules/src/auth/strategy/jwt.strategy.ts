import { IUserService } from 'libs/manager/services/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: IUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: any) {
    console.log('payload', payload);
    const user = await this.userService.userWithPassword(payload.email);

    if (!user) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }

    return { ...user };
  }
}
