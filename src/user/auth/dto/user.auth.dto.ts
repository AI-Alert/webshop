import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  NotContains,
} from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform((param) => param?.value?.toLowerCase())
  @ApiProperty({ example: 'test@user.com' })
  readonly email: string;
}

export class VerifyEmailDto extends EmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly verificationCode: string;
}

export class CreatePasswordDto {
  @IsJWT()
  @ApiProperty()
  readonly inviteToken: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @NotContains(' ', {
    message: '$property cannot have spaces',
  })
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}

export class ResetPasswordDto extends EmailDto {}

export class VerifyResetPasswordDto extends VerifyEmailDto {}

export class SendVerificationCodeDto extends EmailDto {}
