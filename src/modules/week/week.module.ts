import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeekController } from './week.controller';
import { WeekRepo } from './week.repo';
import { Week, WeekSchema } from './week.schema';
import { WeekService } from './week.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Week.name, schema: WeekSchema }]),
  ],
  controllers: [WeekController],
  providers: [WeekService, WeekRepo],
  exports: [WeekService],
})
export class WeekModule {}
