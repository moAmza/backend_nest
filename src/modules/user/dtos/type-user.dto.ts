import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TypeUserDto {
  @ApiProperty({ required: true, default: 'id' })
  @IsString()
  id: string;

  @ApiProperty({ required: true, default: 'username' })
  username: string;

  @ApiProperty({ required: true, default: 'firstname' })
  firstname: string;

  @ApiProperty({ required: true, default: 'lastname' })
  lastname: string;

  @ApiProperty({ required: true, default: new Date() })
  birthday: Date;

  @ApiProperty({ required: true, default: 'Iran' })
  country: string;

  @ApiProperty({ required: true, default: 'test@test.test' })
  email: string;

  @ApiProperty({ default: 'http://localhost:3000/.../image.png' })
  profileImage: string;

  @ApiProperty({ required: true, default: new Date() })
  createdAt: Date;
}
