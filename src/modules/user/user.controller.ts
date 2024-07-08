import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { BaseUserResDto } from './dto/res/base-user.res.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get()
  public async findAll(): Promise<BaseUserResDto[]> {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get information about me' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ): Promise<BaseUserResDto> {
    return await this.userService.findMe(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change information about me' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserReqDto,
  ): Promise<BaseUserResDto> {
    return await this.userService.updateMe(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete my account' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me')
  public async removeMe(
    @CurrentUser() userData: IUserData,
    @Param('id', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return await this.userService.removeMe(userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get user by Id' })
  @Get(':id')
  public async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BaseUserResDto> {
    return await this.userService.getById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload photo' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('file', false)
  public async uploadAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    return await this.userService.uploadAvatar(userData, avatar);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('me/avatar')
  public async deleteAvatar(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.deleteAvatar(userData);
  }
}
