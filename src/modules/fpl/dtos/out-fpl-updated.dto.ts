import { ApiProperty } from '@nestjs/swagger';

export class OutFplUpdatedDto {
  @ApiProperty({ required: true })
  status: true;
}
