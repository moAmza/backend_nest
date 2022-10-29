import { ApiProperty } from '@nestjs/swagger';
import { TypePlayerDto } from './type-player.dto';

export class OutGetPlayerDto {
  @ApiProperty({ required: true })
  player: TypePlayerDto;
}
