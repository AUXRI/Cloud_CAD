import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';



export class AddToFavoriteDto {

  
  @IsString()
  @ApiProperty()
  repoId: string;
  

  @IsString()
  @ApiProperty()
  userId: string;

  
}

