import { OutPaginatedDto } from 'src/dtos/out-paginated.dto';
import { TypeShortUserDto } from 'src/modules/user/dtos/type-short-user.dto';

export class OutGetPaginatedFollowsDto
  implements OutPaginatedDto<TypeShortUserDto>
{
  count: number;
  values: TypeShortUserDto[];
}
