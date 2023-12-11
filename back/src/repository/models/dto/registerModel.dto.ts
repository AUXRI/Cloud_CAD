import { IsString } from 'class-validator';
import { ModelType } from '../schemas/model.schema';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterModelDto {
  @IsString()
  @ApiProperty()
  repoId: string;

  @IsString()
  @ApiProperty({ enum: [0, 1]})
  format: ModelFormat;

  @IsString()
  @ApiProperty({enum: ModelType})
  type: ModelType;
}

export enum ModelFormat {
  gltf,
  step,
}
