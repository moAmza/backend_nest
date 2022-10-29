import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class InAddPlayer {
  @IsNumber()
  @ApiProperty({ required: true, default: 10 })
  position_num: number;
  @IsString()
  @ApiProperty({ required: true, default: 'playerId' })
  player_id: string;
}
