import { IUserService } from 'libs/manager/services/user/user.service';
import { AuthService } from '@app/modules/auth/auth.service';
import { JwtAuthGuard } from '@app/modules/auth/guard/jwt-auth.guard';
import { LocalAuthGuard } from '@app/modules/auth/guard/local-auth.guard';
import { IActiveUserData } from '@app/modules/auth/interface/active-user-data.interface';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'libs/building-block/Decorators/getUser';
import { IsPublic } from 'libs/building-block/Decorators/isPublic';
import { Request } from 'express';
import {
  CreateUserDto,
  RefreshTokenDto,
} from 'libs/building-block/RequestableDTOs/user';
import { CreatePasswordDto } from 'libs/building-block/RequestableDTOs/user/create-password.dto';
import { LoginUserDto } from 'libs/building-block/RequestableDTOs/user/login-user.dto';
import { UserLookupDto } from 'libs/building-block/RequestableDTOs/user/lookup-user.dto';
import { QueryUserDto } from 'libs/building-block/RequestableDTOs/user/query-user.dto';
import { UpdateUserDto } from 'libs/building-block/RequestableDTOs/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'libs/manager/entities';
import { AssignCoursesDto } from 'libs/building-block/RequestableDTOs/user/assign-course.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @IsPublic()
  @Post('login')
  async login(
    @Req() req: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _loginUserDto: LoginUserDto,
  ) {
    const user = req.user as IActiveUserData;
    return this.authService.generateTokens(user);
  }

  @IsPublic()
  @Post('refresh')
  async generateTokenPair(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create')
  async create(@Body() userPayload: CreateUserDto, @GetUser() user: User) {
    return await this.userService.create(userPayload, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAll(@Query() queryUserDto: QueryUserDto) {
    return await this.userService.getAll(queryUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('lookup')
  async lookup(@Query() lookupUser: UserLookupDto, @GetUser() user: User) {
    return await this.userService.lookup(lookupUser, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'id of the tenant',
  })
  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'id of the tenant',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImageKey'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'id of the user',
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }

  @IsPublic()
  @Post('createPassword')
  async createPassword(@Body() body: CreatePasswordDto) {
    return await this.userService.createPassword(body);
  }

  @IsPublic()
  @Post('forgetPassword')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  async forgotPassword(
    @Req() request: Request,
    @Body() user: { email: string },
  ) {
    const origin = request.headers.origin;
    return await this.userService.forgetPassword(user.email, origin);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'id of the user',
  })
  @Post(':id/assign-courses')
  async assignCourses(
    @Param('id') id: string,
    @Body() assignCoursesDto: AssignCoursesDto,
  ) {
    return await this.userService.assignCourses(id, assignCoursesDto.courseIds);
  }
}
