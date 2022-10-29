import { ApiProperty } from '@nestjs/swagger';

export class TypeShortUserDto {
  @ApiProperty({ required: true, default: 'id' })
  id: string;

  @ApiProperty({ required: true, default: 'username' })
  username: string;

  @ApiProperty({ required: true, default: 'firstname' })
  firstname: string;

  @ApiProperty({ required: true, default: 'lastname' })
  lastname: string;

  @ApiProperty({
    required: false,
    default: 'uploads/images/small/default.png',
  })
  profileImage: string;

  @ApiProperty({ required: true, default: false })
  isFollowed: boolean;

  @ApiProperty({ required: true, default: 22 })
  age: number;
}
