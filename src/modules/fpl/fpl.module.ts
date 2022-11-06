import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlayerModule } from '../player/player.module';
import { WeekModule } from '../week/week.module';
import { FplController } from './fpl.controller';
import { FplRepo } from './fpl.repo';
import { FplService } from './fpl.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 15000,
      maxRedirects: 5,
      maxBodyLength: 10000000,
    }),
    PlayerModule,
    WeekModule,
  ],
  controllers: [FplController],
  providers: [FplService, FplRepo],
  exports: [FplService],
})
export class FplModule {}
