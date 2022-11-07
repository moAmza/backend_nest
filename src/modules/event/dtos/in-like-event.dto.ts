import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InLikeEventDto {
  @ApiProperty({ required: false, default: 1 })
  @IsString()
  weekId: string;

  @ApiProperty({ required: false, default: 20 })
  @IsString()
  userId: string;
}
