import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TypeFullUserDto } from 'src/modules/user/dtos/type-full-user.dto';
import { TypeWeekDto } from 'src/modules/week/dtos/type-week.dto';
import { TypeSwapLogDto } from './type-swap-log.dto';

export class TypeEventDto {
  _id: {
    userId: mongoose.Types.ObjectId;
    weekId: mongoose.Types.ObjectId;
  };
  swaps: TypeSwapLogDto[];
}
