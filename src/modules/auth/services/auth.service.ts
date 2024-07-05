import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, EntityManager } from 'typeorm';

import { Role } from '../../../common/enums/role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { BaseUserResDto } from '../../user/dto/res/base-user.res.dto';
import { UserMapper } from '../../user/services/user.mapper';
import { UserService } from '../../user/services/user.service';
import { ChangePasswordReqDto } from '../dto/req/change-password.req.dto';
import { CreateManagerReqDto } from '../dto/req/create-manager.req.dto';
import { ForgotPasswordReqDto } from '../dto/req/forgot-password.req.dto';
import { SetForgotPasswordReqDto } from '../dto/req/set-forgot-password.req.dto';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly dataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });
    await this.refreshTokenRepository.saveToken(
      user.id,
      dto.deviceId,
      tokens.refreshToken,
    );
    await this.authCacheService.saveToken(
      user.id,
      dto.deviceId,
      tokens.accessToken,
    );
    return AuthMapper.toResponseDTO(user, tokens);
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const userEntity = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!userEntity) {
      throw new UnauthorizedException();
    }
    const isPasswordsMatch = await bcrypt.compare(
      dto.password,
      userEntity.password,
    );
    if (!isPasswordsMatch) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepository.findOneBy({ id: userEntity.id });
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
    });
    await this.refreshTokenRepository.delete({
      user_id: user.id,
      deviceId: dto.deviceId,
    });
    await this.authCacheService.deleteToken(user.id, dto.deviceId);
    await this.refreshTokenRepository.saveToken(
      user.id,
      dto.deviceId,
      tokens.refreshToken,
    );
    await this.authCacheService.saveToken(
      user.id,
      dto.deviceId,
      tokens.accessToken,
    );
    return AuthMapper.toResponseDTO(user, tokens);
  }

  public async refreshToken(userData: IUserData): Promise<TokenPairResDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });
    await this.refreshTokenRepository.delete({
      user_id: user.id,
      deviceId: userData.deviceId,
    });
    await this.authCacheService.deleteToken(user.id, userData.deviceId);
    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: userData.deviceId,
    });
    await this.refreshTokenRepository.saveToken(
      user.id,
      userData.deviceId,
      tokens.refreshToken,
    );
    await this.authCacheService.saveToken(
      user.id,
      userData.deviceId,
      tokens.accessToken,
    );
    return tokens;
  }

  public async changePassword(
    dto: ChangePasswordReqDto,
    userData: IUserData,
  ): Promise<string> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const userRepository = em.getRepository(UserEntity);
      const user = await userRepository.findOne({
        where: {
          id: userData.userId,
        },
        select: ['id', 'password'],
      });
      if (!user) {
        throw new NotFoundException();
      }
      const isPasswordsMatch = await bcrypt.compare(
        dto.oldPassword,
        user.password,
      );
      if (!isPasswordsMatch) {
        throw new BadRequestException('Incorrect password');
      }
      const newPassword = await bcrypt.hash(dto.newPassword, 10);
      await userRepository.update(user.id, {
        password: newPassword,
      });
      return 'The password has been changed';
    });
  }

  public async forgotPassword(dto: ForgotPasswordReqDto): Promise<any> {}

  public async setForgotPassword(
    dto: SetForgotPasswordReqDto,
    actionToken: string,
  ): Promise<any> {}

  public async logout(userData: IUserData): Promise<void> {
    await this.refreshTokenRepository.delete({
      user_id: userData.userId,
      deviceId: userData.deviceId,
    });
    await this.authCacheService.deleteToken(userData.userId, userData.deviceId);
  }

  public async changeToSeller(userData: IUserData): Promise<BaseUserResDto> {
    const userEntity = await this.userRepository.findOneBy({
      id: userData.userId,
    });
    if (userEntity.roles === Role.User) {
      userEntity.roles = Role.Seller;
    } else if (userEntity.roles === Role.Seller) {
      userEntity.roles = Role.User;
    }
    const user = await this.userRepository.save({ ...userEntity });
    return UserMapper.toResponseDto(user);
  }

  public async createManager(dto: CreateManagerReqDto): Promise<UserResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);
    const password = await bcrypt.hash(dto.password, 10);

    return await this.userRepository.save(
      this.userRepository.create({ ...dto, password }),
    );
  }
}
