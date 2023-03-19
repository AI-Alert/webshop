import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  public name: string;

  @IsString()
  @ApiProperty()
  public description: string;

  @IsString()
  @ApiProperty()
  public photoUrl: string;
  @IsNumber()
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  public oldPrice: number;
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  public newPrice?: number;
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  public discount?: number;
  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  public rate?: number;
  @IsString()
  @ApiProperty()
  public manufacturer: string;
  @IsString()
  @ApiProperty()
  public manufacturerCountry: string;
  @IsString()
  @ApiProperty()
  public brandName: string;
}
