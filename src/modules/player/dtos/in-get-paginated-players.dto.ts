import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { InPaginatedDto } from 'src/dtos/in-paginated.dto';
import { InSearchableDto } from 'src/dtos/in-searchable.dto';

export class InGetPaginatedPlayers implements InPaginatedDto, InSearchableDto {
  @ApiProperty({ required: false, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  num: number = 20;

  @ApiProperty({ required: false, default: '' })
  @IsString()
  @IsOptional()
  search: string = '';

  @ApiProperty({ required: false, default: 'All' })
  @IsString()
  @IsOptional()
  role: string = 'All';
}
