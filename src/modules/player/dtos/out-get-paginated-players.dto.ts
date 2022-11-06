import { OutPaginatedDto } from 'src/dtos/out-paginated.dto';
import { TypePlayerDto } from './type-player.dto';

export class OutGetPaginatedPlayersDto
  implements OutPaginatedDto<TypePlayerDto>
{
  count: number;
  values: TypePlayerDto[];
}
