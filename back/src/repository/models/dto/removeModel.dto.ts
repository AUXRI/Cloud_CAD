import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveModelDto {
  @IsString()
  @ApiProperty()
  repoId: string;

  @IsString()
  @ApiProperty()
  modelId: string;
}
