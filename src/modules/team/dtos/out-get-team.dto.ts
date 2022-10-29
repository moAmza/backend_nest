import { ApiProperty } from '@nestjs/swagger';
import { TypeTeamDto } from './type-team.dto';

export class OutGetTeamDto {
  @ApiProperty({ required: true })
  team: TypeTeamDto;
}
