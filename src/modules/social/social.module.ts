import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialController } from './social.controller';
import { FollowRepo } from './follow.repo';
import { Follow, FollowSchema } from './follow.schema';
import { FollowService } from './social.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    UserModule,
  ],
  controllers: [SocialController],
  providers: [FollowService, FollowRepo],
  exports: [FollowService],
})
export class SocialModule {}
