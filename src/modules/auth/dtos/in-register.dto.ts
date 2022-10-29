import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class InRegisterDto {
  @ApiProperty({ required: true, default: 'username' })
  @IsString()
  username: string;

  @ApiProperty({ required: true, default: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ required: true, default: 'firstname' })
  @IsString()
  firstname: string;

  @ApiProperty({ required: true, default: 'lastnamee' })
  @IsString()
  lastname: string;

  @ApiProperty({ required: true, default: 'country' })
  @IsString()
  country: string;

  @ApiProperty({ required: true, default: 'email@email.email' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, default: new Date(), type: 'date' })
  @IsString()
  birthday: Date;
}
