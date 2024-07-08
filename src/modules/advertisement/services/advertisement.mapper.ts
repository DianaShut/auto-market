import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AdvertisementListReqDto } from '../dto/req/adv-list.req.dto';
import { AdvertisementListResDto } from '../dto/res/adv-list.res.dto';
import { BaseAdvertisementResDto } from '../dto/res/base-adv.res.dto';

export class AdvertisementMapper {
  public static toResponseDto(
    advertisementEntity: AdvertisementEntity,
  ): BaseAdvertisementResDto {
    return {
      id: advertisementEntity.id,
      brand: advertisementEntity.brand,
      model: advertisementEntity.model,
      price: advertisementEntity.price,
      currency: advertisementEntity.currency,
      description: advertisementEntity.description,
      created: advertisementEntity.created,
      updated: advertisementEntity.updated,
      isValidate: advertisementEntity.isValidate,

      user: advertisementEntity.user
        ? UserMapper.toResponseDto(advertisementEntity.user)
        : null,
    };
  }

  public static toListResponseDto(
    entities: AdvertisementEntity[],
    total: number,
    query: AdvertisementListReqDto,
  ): AdvertisementListResDto {
    return {
      data: entities.map(this.toResponseDto),
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
      },
    };
  }
}
