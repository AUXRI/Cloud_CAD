import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ObjectDto {
  @IsString()
  @ApiProperty()
  repoId: string;

  @IsString()
  @ApiProperty()
  path: string;

  @IsString()
  @ApiProperty()
  fullname: string;
}
