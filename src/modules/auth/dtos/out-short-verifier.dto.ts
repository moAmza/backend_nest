import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OutShortVerifierDto {
  @ApiProperty({ required: true, default: true })
  status: boolean;

  @ApiProperty({ required: true, default: 0 })
  count: number;
}
