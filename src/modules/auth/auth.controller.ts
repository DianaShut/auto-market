import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { BaseUserReqDto } from '../user/dto/req/base-user.req.dto';
import { BaseUserResDto } from '../user/dto/res/base-user.res.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { ChangePasswordReqDto } from './dto/req/change-password.req.dto';
import { CreateManagerReqDto } from './dto/req/create-manager.req.dto';
import { ForgotPasswordReqDto } from './dto/req/forgot-password.req.dto';
import { SetForgotPasswordReqDto } from './dto/req/set-forgot-password.req.dto';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration' })
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.signIn(dto);
  }

  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refreshToken(userData);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Change password' })
  @Post('change-password')
  public async changePassword(
    @CurrentUser() userData: IUserData,
    @Body() dto: ChangePasswordReqDto,
  ): Promise<string> {
    return await this.authService.changePassword(dto, userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  public async forgotPassword(
    @Body() dto: ForgotPasswordReqDto,
  ): Promise<string> {
    return await this.authService.forgotPassword(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Set forgot password' })
  @Post('/forgot-password/:token')
  public async setForgotPassword(
    @Body() dto: SetForgotPasswordReqDto,
    @Param('token') token: string,
  ): Promise<string> {
    return await this.authService.setForgotPassword(dto, token);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @Roles(Role.Seller, Role.User)
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Change to seller or user' })
  @Put('seller')
  public async changeToSeller(
    @CurrentUser() userData: IUserData,
  ): Promise<BaseUserResDto> {
    return await this.authService.changeToSeller(userData);
  }

  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Create manager' })
  @Post('create-manager')
  public async createUser(
    @Body() dto: CreateManagerReqDto,
  ): Promise<BaseUserReqDto> {
    return await this.authService.createManager(dto);
  }
}
