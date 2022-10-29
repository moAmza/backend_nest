import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeekModule } from '../week/week.module';
import { PlayerController } from './player.controller';
import { PlayerRepo } from './player.repo';
import { Player, PlayerSchema } from './player.schema';
import { PlayerService } from './player.service';
import { StatsRepo } from './stats.repo';
import { Stats, StatsSchema } from './stats.schema';
import { StatsService } from './stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Stats.name, schema: StatsSchema },
    ]),
    WeekModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepo, StatsService, StatsRepo],
  exports: [PlayerService],
})
export class PlayerModule {}
