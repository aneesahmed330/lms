import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { RefreshTokenIdsStorageService } from '../redis/refreshTokenIdsStorage.service';
import { IActiveUserData } from './interface/active-user-data.interface';

import { RefreshTokenDto } from 'libs/building-block/RequestableDTOs';
import { IUserService } from 'libs/manager/services/user/user.service';
import { ServiceError } from 'libs/building-block/filters/service-error';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: IUserService,
    private refreshTokenIdsStorageService: RefreshTokenIdsStorageService,
  ) {}

  async validateUser(email: string, password: string, visitorId: string) {
    try {
      const user = await this.userService.userWithPassword(email);

      if (!user) return null;

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      // Handle visitor ID logic
      if (!user.visitorId) {
        // First time login, set the visitor ID
        await this.userService.update(user.id, { visitorId });
      } else if (user.visitorId !== visitorId) {
        // Visitor ID mismatch
        throw new ServiceError(
          'User',
          'Device Id does not match!',
          'Device Id does not match!',
          HttpStatus.BAD_REQUEST,
        );
      }

      return user;
    } catch (err) {
      throw new ServiceError(
        'User',
        'Something went wrong!',
        err.message ?? 'Something went wrong!',
        err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateTokens(user: IActiveUserData) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IActiveUserData>>(
        user.id,
        +process.env.JWT_ACCESS_TOKEN_TTL,
        {
          email: user.email,
        },
      ),
      this.signToken(user.id, +process.env.JWT_REFRESH_TOKEN_TTL, {
        refreshTokenId,
      }),
    ]);

    // insert into redis database
    await this.refreshTokenIdsStorageService.insert(user.id, refreshTokenId);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { id, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'id'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.getUserById(id);
      const isValid = await this.refreshTokenIdsStorageService.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorageService.invalidate(user.id);
      } else {
        throw new BadRequestException('Refresh token is not valid anymore');
      }

      return this.generateTokens({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.userRole,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      },
      {
        expiresIn,
        secret: process.env.JWT_SECRET,
      },
    );
  }
}
