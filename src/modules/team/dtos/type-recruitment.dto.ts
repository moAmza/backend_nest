import { ApiProperty } from '@nestjs/swagger';

export class TypeRecruitmentDto {
  @ApiProperty({ required: true, default: 10 })
  positionNum: number;
  @ApiProperty({ required: true, default: true })
  isPlaying: boolean;
  @ApiProperty({ required: true, default: 'team_name' })
  playerId: string;
  @ApiProperty({ required: true, default: 100 })
  teamId: string;
}
