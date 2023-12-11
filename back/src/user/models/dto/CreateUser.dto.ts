import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  login: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  lastName: string;
}
