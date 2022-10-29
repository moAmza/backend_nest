import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TypeWeekDto {
  @ApiProperty({ required: true, default: 'id' })
  id: string;
  @ApiProperty({ required: true, default: 10 })
  refId: number;
  @ApiProperty({ required: true, default: 10 })
  weekNum: number;
  @ApiProperty({ required: true, default: new Date() })
  endDate: Date;
  @ApiProperty({ required: true, default: new Date() })
  deadlineDate: Date;
  @ApiProperty({ required: true, default: true })
  isCurrent: boolean;
  @ApiProperty({ required: true, default: false })
  isNext: boolean;
  @ApiProperty({ required: true, default: false })
  isPrevious: boolean;
}
