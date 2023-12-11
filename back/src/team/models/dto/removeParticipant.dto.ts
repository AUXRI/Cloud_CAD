import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserEntryDto } from 'src/user/models/dto/userEntry.dto';

export class RemoveParticipantDto extends UserEntryDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  teamId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  repoId?: string;
}
