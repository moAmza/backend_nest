import { TypeShortUserDto } from 'src/modules/user/dtos/type-short-user.dto';
import { TypeWeekDto } from 'src/modules/week/dtos/type-week.dto';
import { OutSwapLogDto } from './out-swap-log.dto';

export class OutEventDto {
  user: TypeShortUserDto;
  week: TypeWeekDto;
  swaps: OutSwapLogDto[];
}
