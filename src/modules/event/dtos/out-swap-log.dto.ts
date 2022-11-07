import { TypePlayerDto } from 'src/modules/player/dtos/type-player.dto';

export class OutSwapLogDto {
  pastPlayer: TypePlayerDto;
  nextPlayer: TypePlayerDto;
  positionNum1: number;
  positionNum2: number;
}
