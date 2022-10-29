import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TypeStatsDto } from './type-stats.dto';

export class TypePlayerDto {
  @ApiProperty({ required: true, default: 'id' })
  id: string;
  @ApiProperty({ required: true, default: 10 })
  refId: number;
  @ApiProperty({ required: true, default: 'firstName' })
  firstName: string;
  @ApiProperty({ required: true, default: 'secondName' })
  secondName: string;
  @ApiProperty({ required: true, default: 'webname' })
  webname: string;
  @ApiProperty({ required: true, default: 'club' })
  club: string;
  @ApiProperty({ required: true, default: 'FORWARD' })
  role: PlayerRolesType;
  playerStats: TypeStatsDto;
  @ApiProperty({ required: true, type: 'date', default: new Date() })
  createdAt: Date;
}
