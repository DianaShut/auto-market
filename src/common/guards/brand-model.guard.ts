import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { CarBrandRepository } from '../../modules/repository/services/carBrand.repository';
import { CarModelRepository } from '../../modules/repository/services/carModel.repository';

@Injectable()
export class BrandModelGuard implements CanActivate {
  constructor(
    private carBrandRepository: CarBrandRepository,
    private carModelRepository: CarModelRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const brand = request.body.brand;
    const model = request.body.model;

    const brandIsExist = await this.carBrandRepository.findOneBy({ brand });
    if (!brandIsExist) {
      throw new UnprocessableEntityException('Brand not found');
    }
    const modelIsExist = await this.carModelRepository.findOneBy({ model });
    if (!modelIsExist) {
      throw new UnprocessableEntityException('Model not found');
    }

    return true;
  }
}
