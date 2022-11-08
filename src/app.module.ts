import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { FplModule } from './modules/fpl/fpl.module';
import { PlayerModule } from './modules/player/player.module';
import { SocialModule } from './modules/social/social.module';
import { TeamModule } from './modules/team/team.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { WeekModule } from './modules/week/week.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './modules/event/event.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './modules/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, 'public') }),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}/nest`),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({ transport: process.env.MAIL_SERVICE_CREDENTIALS }),
    PlayerModule,
    UserModule,
    AuthModule,
    WeekModule,
    TeamModule,
    SocialModule,
    EventModule,
    FplModule,
    UploadModule,
    MailModule,
  ],
})
export class AppModule {}
