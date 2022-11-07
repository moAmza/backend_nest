import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventLogRepo } from './event-log.repo';
import { EventLog, EventLogSchema } from './event-log.schema';
import { EventService } from './event.service';
import { SocialModule } from '../social/social.module';
import { WeekModule } from '../week/week.module';
import { UserModule } from '../user/user.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
    ]),
    SocialModule,
    WeekModule,
    UserModule,
    PlayerModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventLogRepo],
  exports: [EventService],
})
export class EventModule {}
