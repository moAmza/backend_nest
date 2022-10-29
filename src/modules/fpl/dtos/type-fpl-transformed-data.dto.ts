import { TypeFplPlayerDto } from './type-fpl-player.dto';
import { TypeFplWeekDto } from './type-fpl-week.dto';

export class TypeFplTransformedDataDto {
  players: TypeFplPlayerDto[];
  weeks: TypeFplWeekDto[];
}
