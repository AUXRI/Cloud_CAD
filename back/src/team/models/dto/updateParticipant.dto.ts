import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UserEntryDto } from 'src/user/models/dto/userEntry.dto';

export class UpdateParticipantDto extends UserEntryDto {
  @IsString()
  @IsOptional()
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
