import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '@app/modules/auth/guard/local-auth.guard';
import { IsPublic } from 'libs/building-block/Decorators/isPublic';
import { LoginUserDto } from 'libs/building-block/RequestableDTOs/user/login-user.dto';
import { RefreshTokenDto } from 'libs/building-block/RequestableDTOs';
import { AuthService } from '@app/modules/auth/auth.service';
import { IRequest } from 'libs/building-block/Interfaces/common.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @IsPublic()
  @Post('login')
  @ApiOperation({ summary: 'Login to the application and generate tokens' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in and tokens generated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    description: 'Login user credentials',
    type: LoginUserDto,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req: IRequest, @Body() _loginUserDto: LoginUserDto) {
    return this.authService.generateTokens(req.user);
  }

  @IsPublic()
  @Post('refresh')
  @ApiOperation({ summary: 'Generate a new token pair using refresh token' })
  @ApiBody({
    description: 'Refresh token data',
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'New token pair generated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid refresh token' })
  async generateTokenPair(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
