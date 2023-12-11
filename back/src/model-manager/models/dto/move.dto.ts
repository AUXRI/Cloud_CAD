import { ApiProperty } from '@nestjs/swagger';
import { ObjectDto } from './object.dto';
import { IsString } from 'class-validator';

export class MoveDto extends ObjectDto {
  @IsString()
  @ApiProperty()
  newPath: string;
}
