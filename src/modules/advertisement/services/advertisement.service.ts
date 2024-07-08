import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { EAccountType } from '../../../database/entities/enums/account-type.enum';
import { StatusEnum } from '../../../database/entities/enums/adv-status.enum';
import { CurrencyEnum } from '../../../database/entities/enums/currency-type.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AwsService } from '../../aws/aws.service';
import { FileTypeEnum } from '../../aws/models/enums/file-type.enum';
import { CurrencyService } from '../../currency/currency.service';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { CurrencyRepository } from '../../repository/services/currency.repository';
import { PhotoRepository } from '../../repository/services/photo.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ViewRepository } from '../../repository/services/view.repository';
import { AdvertisementListReqDto } from '../dto/req/adv-list.req.dto';
import { CreateAdvertisementReqDto } from '../dto/req/create-adv.req.dto';
import { UpdateAdvertisementReqDto } from '../dto/req/update-adv.req.dto';
import { AdvertisementResDto } from '../dto/res/adv.res.dto';
import { AdvertisementListResDto } from '../dto/res/adv-list.res.dto';
import { BaseAdvertisementResDto } from '../dto/res/base-adv.res.dto';
import { AdvertisementMapper } from './advertisement.mapper';
import { ProfanityFilterService } from './profanity-filter.service';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly currencyService: CurrencyService,
    private userRepository: UserRepository,
    private viewRepository: ViewRepository,
    private photoRepository: PhotoRepository,
    private awsService: AwsService,
    private profanityFilterService: ProfanityFilterService,
  ) {}

  public async findAll(
    query: AdvertisementListReqDto,
  ): Promise<AdvertisementListResDto> {
    const [entities, total] = await this.advertisementRepository.findAll(query);
    return AdvertisementMapper.toListResponseDto(entities, total, query);
  }

  public async findOne(
    advertisementId: string,
    userData: IUserData,
  ): Promise<BaseAdvertisementResDto> {
    const advertisement = await this.advertisementRepository.findOne({
      where: { id: advertisementId },
    });
    await this.viewRepository.save({
      advertisement_id: advertisementId,
    });
    const account = await this.userRepository.findOneBy({
      id: userData.userId,
    });
    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }
    if (account.accountType === EAccountType.PREMIUM) {
      const dayViews =
        await this.viewRepository.findViewsByDay(advertisementId);
      const weekViews =
        await this.viewRepository.findViewsByWeek(advertisementId);
      const monthViews =
        await this.viewRepository.findViewsByMonth(advertisementId);
      const averagePriсe =
        await this.advertisementRepository.averagePrice(advertisement);
    }
    return AdvertisementMapper.toResponseDto(advertisement);
  }

  public async create(
    dto: CreateAdvertisementReqDto,
    userData: IUserData,
  ): Promise<BaseAdvertisementResDto> {
    const EUR = await this.currencyRepository.findOneBy({
      currency: CurrencyEnum.EUR,
    });
    const USD = await this.currencyRepository.findOneBy({
      currency: CurrencyEnum.USD,
    });
    let PriceUSD: number;
    if (dto.currency === CurrencyEnum.USD) {
      PriceUSD = dto.price / USD.selling;
    } else if (dto.currency === CurrencyEnum.EUR) {
      PriceUSD = (dto.price * USD.buying) / EUR.selling;
    } else {
      PriceUSD = +dto.price;
    }
    const advertisementEntity = await this.advertisementRepository.save(
      this.advertisementRepository.create({
        ...dto,
        user_id: userData.userId,
        isValidate: StatusEnum.ACTIVE,
        priceFunc: PriceUSD,
      }),
    );
    return AdvertisementMapper.toResponseDto(advertisementEntity);
  }

  public async findMyAdvertisement(
    query: AdvertisementListReqDto,
    userData: IUserData,
  ): Promise<AdvertisementListResDto> {
    const [entities, total] =
      await this.advertisementRepository.findAllMyAdvertisement(
        query,
        userData,
      );
    return AdvertisementMapper.toListResponseDto(entities, total, query);
  }

  public async update(
    advertisementId: string,
    dto: UpdateAdvertisementReqDto,
    userData: IUserData,
  ): Promise<AdvertisementResDto> {
    const advertisement = await this.findMyOneByIdOrThrow(
      advertisementId,
      userData,
    );
    const newAdvertisement = await this.advertisementRepository.save({
      ...advertisement,
      ...dto,
    });
    return AdvertisementMapper.toResponseDto(newAdvertisement);
  }

  public async remove(advertisementId: string, userData: IUserData) {
    const advertisement = await this.findMyOneByIdOrThrow(
      advertisementId,
      userData,
    );
    const photoEntity = await this.photoRepository.findBy({
      advertisement_id: advertisementId,
    });
    for (const photo of photoEntity) {
      await this.awsService.deleteFile(photo.photoUrl);
      await this.photoRepository.remove(photo);
    }
    await this.advertisementRepository.remove(advertisement);
  }

  private async findMyOneByIdOrThrow(
    advertisementId: string,
    userData: IUserData,
  ): Promise<AdvertisementEntity> {
    const advertisement = await this.advertisementRepository.findOneBy({
      id: advertisementId,
    });
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });
    if (!advertisement) {
      throw new UnprocessableEntityException();
    }
    return advertisement;
  }

  public async uploadPhotos(
    files: Array<Express.Multer.File>,
    advertisementId: string,
    userData: IUserData,
  ): Promise<any> {
    const advertisement = await this.findMyOneByIdOrThrow(
      advertisementId,
      userData,
    );
    const pathFile = await this.awsService.uploadFiles(
      files,
      FileTypeEnum.ADV_IMAGE,
      advertisementId,
    );
    for (const path of pathFile) {
      await this.photoRepository.save({
        photo: path,
        advertisement_id: advertisementId,
      });
    }
    return 'Photo upload';
  }
}
