import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expireDate: Date;

  @ApiPropertyOptional()
  userId?: number;
}
