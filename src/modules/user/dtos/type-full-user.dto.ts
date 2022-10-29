import { ApiProperty } from '@nestjs/swagger';
import { TypeShortUserDto } from './type-short-user.dto';

export class TypeFullUserDto extends TypeShortUserDto {
  @ApiProperty({ required: false, default: new Date() })
  birthday: Date;

  @ApiProperty({ required: false, default: 'Iran' })
  country: string;

  @ApiProperty({ required: false, default: 10 })
  score: number;

  @ApiProperty({ required: true, default: 'test@test.test' })
  email: string;

  @ApiProperty({ required: true, type: 'date', default: new Date() })
  createdAt: Date;
}
