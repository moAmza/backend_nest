import { OutPaginatedDto } from 'src/dtos/out-paginated.dto';
import { TypeShortUserDto } from './type-short-user.dto';

export class OutGetPaginatedUsersDto
  implements OutPaginatedDto<TypeShortUserDto>
{
  count: number;
  values: TypeShortUserDto[];
}
