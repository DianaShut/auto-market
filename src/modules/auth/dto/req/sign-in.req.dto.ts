import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { SignUpReqDto } from './sign-up.req.dto';

export class SignInReqDto extends PickType(SignUpReqDto, [
  'deviceId',
  'email',
  'password',
]) {
  @ApiProperty({ example: 'test@example.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
