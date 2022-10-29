import { OutPaginatedDto } from 'src/dtos/out-paginated.dto';
import { TypeShortUserDto } from 'src/modules/user/dtos/type-short-user.dto';

export class OutGetPaginatedFollowsDto implements OutPaginatedDto {
  count: number;
  values: TypeShortUserDto[];
}
