import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class InConfirmDto {
  @ApiProperty({ required: true, default: 'email@email.email' })
  @IsString()
  email: string;

  @ApiProperty({ required: true, default: 1000 })
  @IsNumber()
  code: number;
}
