import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AwsService } from '../../aws/aws.service';
import { FileTypeEnum } from '../../aws/models/enums/file-type.enum';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { BaseUserResDto } from '../dto/res/base-user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly awsService: AwsService,
  ) {}

  public async findAll(): Promise<BaseUserResDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => UserMapper.toResponseDto(user));
  }

  public async findMe(userData: IUserData): Promise<BaseUserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDto(user);
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<BaseUserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const updatedUser = await this.userRepository.save({ ...user, ...dto });
    return UserMapper.toResponseDto(updatedUser);
  }

  public async removeMe(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }

  public async getById(userId: string): Promise<BaseUserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toResponseDto(user);
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email is already taken');
    }
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.awsService.uploadFile(
      avatar,
      FileTypeEnum.USER_AVATAR,
      userData.userId,
    );
    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.awsService.deleteFile(user.image);
      await this.userRepository.save(
        this.userRepository.merge(user, { image: null }),
      );
    }
  }
}
