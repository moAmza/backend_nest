import { OutPaginatedDto } from 'src/dtos/out-paginated.dto';
import { OutEventDto } from './out-event.dto';

export class OutGetPaginatedEventsDto implements OutPaginatedDto<OutEventDto> {
  count: number;
  values: OutEventDto[];
}
