import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordReqDto {
  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  oldPassword: string;

  @ApiProperty({ example: '123qwe!&@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  newPassword: string;
}
