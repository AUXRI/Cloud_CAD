import { ApiProperty } from "@nestjs/swagger";

export class FindRepositoryDto {
  @ApiProperty()
  queryStr: string;
}
