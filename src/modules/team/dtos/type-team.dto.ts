import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeStatsDto } from './type-stats.dto';
import { TypeTeamPlayerDto } from './type-team-player.dto';

export class TypeTeamDto {
  @ApiProperty({ required: true, default: 'id' })
  id: string;
  @ApiProperty({ required: true, default: 'user_id' })
  userId: string;
  @ApiProperty({ required: true, default: 'team_name' })
  name: string;
  @ApiProperty({ required: true, default: 100 })
  credit: number;
  @ApiProperty({ required: true })
  players: TypeTeamPlayerDto[];
}
