import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from '../player/player.module';
import { WeekModule } from '../week/week.module';
import { TeamController } from './team.controller';
import { TeamRepo } from './team.repo';
import { Team, TeamSchema } from './team.schema';
import { TeamService } from './team.service';
import { RecruitmentRepo } from './recruitment.repo';
import { Recruitment, RecruitmentSchema } from './recruitment.schema';
import { RecruitmentService } from './recruitment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Recruitment.name, schema: RecruitmentSchema },
    ]),
    PlayerModule,
  ],
  controllers: [TeamController],
  providers: [RecruitmentService, RecruitmentRepo, TeamService, TeamRepo],
  exports: [TeamService],
})
export class TeamModule {}
