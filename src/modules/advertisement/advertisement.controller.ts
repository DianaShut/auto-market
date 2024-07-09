import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AdvertisementLimits } from '../../common/guards/adv-limit';
import { BrandModelGuard } from '../../common/guards/brand-model.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { AdvertisementListReqDto } from './dto/req/adv-list.req.dto';
import { CreateAdvertisementReqDto } from './dto/req/create-adv.req.dto';
import { UpdateAdvertisementReqDto } from './dto/req/update-adv.req.dto';
import { AdvertisementResDto } from './dto/res/adv.res.dto';
import { AdvertisementListResDto } from './dto/res/adv-list.res.dto';
import { BaseAdvertisementResDto } from './dto/res/base-adv.res.dto';
import { AdvertisementService } from './services/advertisement.service';

@ApiTags('Advertisement')
@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Get all advertisement' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get()
  public async findAll(
    @Query() query: AdvertisementListReqDto,
  ): Promise<AdvertisementListResDto> {
    return await this.advertisementService.findAll(query);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get one advertisement by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':advertisementId')
  public async findOne(
    @Param('advertisementId') advertisementId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<BaseAdvertisementResDto> {
    return await this.advertisementService.findOne(advertisementId, userData);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager, Role.Seller)
  @UseGuards(BrandModelGuard, AdvertisementLimits)
  @ApiOperation({ summary: 'Post advertisement' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  public async create(
    @Body() dto: CreateAdvertisementReqDto,
    @CurrentUser() userData: IUserData,
  ): Promise<any> {
    return await this.advertisementService.create(dto, userData);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager, Role.Seller)
  @ApiOperation({ summary: 'Get all my advertisement' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('my-advertisement')
  public async findMyAdvertisement(
    @Query() query: AdvertisementListReqDto,
    @CurrentUser() userData: IUserData,
  ): Promise<AdvertisementListResDto> {
    return await this.advertisementService.findMyAdvertisement(query, userData);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager, Role.Seller)
  @ApiOperation({ summary: 'Change advertisement' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put(':advertisementId')
  public async update(
    @Param('advertisementId') advertisementId: string,
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateAdvertisementReqDto,
  ): Promise<any> {
    return await this.advertisementService.update(
      advertisementId,
      dto,
      userData,
    );
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager, Role.Seller)
  @ApiOperation({ summary: 'Delete advertisement' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete(':advertisementId')
  public async remove(
    @Param('advertisementId') advertisementId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<void> {
    await this.advertisementService.remove(advertisementId, userData);
  }

  @ApiBearerAuth()
  @Roles(Role.Admin, Role.Manager, Role.Seller)
  @Post(':advertisementId/photos')
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Upload Advertisement photo' })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('files', true)
  public async uploadPhotos(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Param('advertisementId') advertisementId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<any> {
    return await this.advertisementService.uploadPhotos(
      files,
      advertisementId,
      userData,
    );
  }
}
