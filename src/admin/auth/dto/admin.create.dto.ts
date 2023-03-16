import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminStatuses } from '@shared/enums';

// eslint-disable-next-line @typescript-eslint/ban-types
export class CreateAdminDto {
  @ApiProperty({ enum: AdminStatuses })
  public status: AdminStatuses;
  deletedAt?: Date;

  @IsString()
  @ApiProperty()
  public firstName: string;

  @IsString()
  @ApiProperty()
  public lastName: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  public email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  public password: string;
}
