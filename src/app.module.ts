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

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, 'public') }),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    PlayerModule,
    UserModule,
    AuthModule,
    WeekModule,
    TeamModule,
    SocialModule,
    FplModule,
    UploadModule,
  ],
})
export class AppModule {}
