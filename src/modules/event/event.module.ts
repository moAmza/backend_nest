import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { SwapLogRepo } from './swap-log.repo';
import { SwapLog, SwapLogSchema } from './swap-log.schema';
import { EventService } from './event.service';
import { SocialModule } from '../social/social.module';
import { WeekModule } from '../week/week.module';
import { UserModule } from '../user/user.module';
import { PlayerModule } from '../player/player.module';
import { LikeEventRepo } from './like-event.repo';
import { LikeEvent, LikeEventSchema } from './like-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SwapLog.name, schema: SwapLogSchema },
      { name: LikeEvent.name, schema: LikeEventSchema },
    ]),
    SocialModule,
    WeekModule,
    UserModule,
    PlayerModule,
  ],
  controllers: [EventController],
  providers: [EventService, SwapLogRepo, LikeEventRepo],
  exports: [EventService],
})
export class EventModule {}
