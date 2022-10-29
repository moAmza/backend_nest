import { ApiProperty } from '@nestjs/swagger';
import { TypeWeekDto } from './type-week.dto';

export class OutGetWeekDto {
  @ApiProperty({ required: true })
  week: TypeWeekDto;
}
