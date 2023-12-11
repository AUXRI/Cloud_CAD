import { IsNumber, IsOptional, IsString } from 'class-validator';
import { RepositoryType } from '../schemas/repository.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRepositoryDto {
  @IsString()
  @ApiProperty()
  author: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  team?: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsNumber()
  @ApiProperty({ enum: RepositoryType})
  type: RepositoryType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  preview?: string;
}
