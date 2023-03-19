import { IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  skip?: number;

  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  limit?: number;
}

export class IdParams {
  @IsNumberString()
  @ApiProperty()
  public id: string;
}
