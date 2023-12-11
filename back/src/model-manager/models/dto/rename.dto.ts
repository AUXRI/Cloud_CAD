import { ApiProperty } from '@nestjs/swagger';
import { ObjectDto } from './object.dto';
import { IsString } from 'class-validator';

export class RenameDto extends ObjectDto {
  @IsString()
  @ApiProperty()
  newName: string;
}
