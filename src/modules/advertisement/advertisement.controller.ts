import { Controller } from '@nestjs/common';

import { AdvertisementService } from './services/advertisement.service';

@Controller('user')
export class AdvertisementController {
  constructor(private readonly userService: AdvertisementService) {}
}
