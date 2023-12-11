import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UserEntryDto } from 'src/user/models/dto/userEntry.dto';

export class AddParticipantDto extends UserEntryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  teamId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  repoId?: string;

  @IsNumber()
  @ApiProperty()
  role: number;
}
