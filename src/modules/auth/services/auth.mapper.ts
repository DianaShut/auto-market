import { UserEntity } from '../../../database/entities/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ITokenPair } from '../interfaces/token-pair.interface';

export class AuthMapper {
  public static toResponseDTO(
    user: UserEntity,
    tokens: ITokenPair,
  ): AuthResDto {
    return {
      tokens: this.toResponseTokensDTO(tokens),
      user: UserMapper.toResponseDto(user),
    };
  }

  public static toResponseTokensDTO(tokenPair: ITokenPair): TokenPairResDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }
}
