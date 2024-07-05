import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ForgotPasswordReqDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;
}
