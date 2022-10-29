import { ApiProperty } from '@nestjs/swagger';

export class TypeStatsDto {
  @ApiProperty({ required: true, default: 'id' })
  id: string;
  @ApiProperty({ required: true, default: 100 })
  score: number;
  @ApiProperty({ required: true, default: 50 })
  price: number;
}
