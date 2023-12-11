import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserEntryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  userId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  login?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string;
}
