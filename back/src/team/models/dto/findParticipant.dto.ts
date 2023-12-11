import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntryDto } from 'src/user/models/dto/userEntry.dto';

export class FindParticipantDto extends UserEntryDto {
  @IsString()
  @ApiProperty()
  teamId: string;
}
