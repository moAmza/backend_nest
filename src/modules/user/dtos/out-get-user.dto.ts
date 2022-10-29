import { ApiProperty } from '@nestjs/swagger';
import { TypeShortUserDto } from './type-short-user.dto';

export class OutGetUserDto {
  @ApiProperty({ required: true })
  user: TypeShortUserDto;
}
