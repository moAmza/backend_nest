import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypePlayerDto } from 'src/modules/player/dtos/type-player.dto';
import { TypeStatsDto } from './type-stats.dto';

export class TypeTeamPlayerDto extends TypePlayerDto {
  @ApiProperty({ required: true, default: 5 })
  positionNum: number;
  @ApiProperty({ required: true, default: true })
  isPlaying: boolean;
}
