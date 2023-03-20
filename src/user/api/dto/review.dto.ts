import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  @ApiProperty()
  public advantage: string;

  @IsString()
  @ApiProperty()
  public disadvantage: string;

  @IsString()
  @ApiProperty()
  public comment: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  public rate?: number;
}
