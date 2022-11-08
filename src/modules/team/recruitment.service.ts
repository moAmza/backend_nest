import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { TeamRepo } from './team.repo';
import { TeamDao } from './daos/team.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { TypeTeamDto } from './dtos/type-team.dto';
import { RecruitmentRepo } from './recruitment.repo';
import { RecruitmentDao } from './daos/recruitment.dao';
import { WeekService } from '../week/week.service';
import { PlayerService } from '../player/player.service';
import { TypePlayerDto } from '../player/dtos/type-player.dto';
import { BaseError } from '../../errors/base-error';
import { TypeRecruitmentDto } from './dtos/type-recruitment.dto';
import { TeamService } from './team.service';
import { TypeTeamPlayerDto } from './dtos/type-team-player.dto';

@Injectable()
export class RecruitmentService {
  constructor(
    private readonly recruitmentRepo: RecruitmentRepo,
    private readonly playerService: PlayerService,
  ) {}

  async createOne(
    team: TypeTeamDto,
    isPlaying: boolean,
    playerId: string,
    positionNum: number,
  ): Promise<TypeRecruitmentDto | NotFoundError | BadRequestError> {
    const player = await this.playerService.getPlayerByid(playerId);
    if (player instanceof BaseError) return player;
    const recruitModel = await this.recruitmentRepo.createOne({
      teamId: new mongoose.Types.ObjectId(team.id),
      playerId: new mongoose.Types.ObjectId(player.id),
      positionNum,
      isPlaying,
      createdAt: new Date(),
    });

    return RecruitmentDao.convertOne(recruitModel);
  }

  async removeOne(
    team: TypeTeamDto,
    positionNum: number,
  ): Promise<true | NotFoundError> {
    const recruitment = await this.recruitmentRepo.removeOne(
      new mongoose.Types.ObjectId(team.id),
      positionNum,
    );
    if (!recruitment) return new NotFoundError('Player');
    return true;
  }

  async getTeamPlayerByPositionNum(
    teamId: string,
    positionNum: number,
  ): Promise<TypeTeamPlayerDto | BadRequestError | NotFoundError> {
    const recruitmentModel = await this.recruitmentRepo.getByPositionNum(
      teamId,
      positionNum,
    );
    if (!recruitmentModel) return new BadRequestError('InvalidePosition');
    const player = await this.playerService.getPlayerByid(
      recruitmentModel.playerId.toString(),
    );
    if (player instanceof BaseError) return player;
    const recruitment = RecruitmentDao.convertOne(recruitmentModel);
    return RecruitmentDao.transformPlayerToTeamPlayer(recruitment, player);
  }

  async getPlayersFromRecruitments(
    recruitments: TypeRecruitmentDto[],
  ): Promise<TypeTeamPlayerDto[] | NotFoundError | BadRequestError> {
    const players = await Promise.all(
      recruitments.map((rec) =>
        this.playerService
          .getPlayerByid(rec.playerId.toString())
          .then((player) => {
            if (player instanceof BaseError) throw player;
            return player;
          })
          .then((player) =>
            RecruitmentDao.transformPlayerToTeamPlayer(rec, player),
          ),
      ),
    ).catch((e) => {
      if (e instanceof NotFoundError || e instanceof BadRequestError) return e;
      throw e;
    });
    if (players instanceof BaseError) return players;
    return players;
  }

  async swapPlayerIds(
    teamId: string,
    positionNum1: number,
    positionNum2: number,
  ): Promise<true | BadRequestError> {
    const recModel1 = await this.recruitmentRepo.getByPositionNum(
      teamId,
      positionNum1,
    );
    if (!recModel1) return new BadRequestError('InvalidePosition');
    const recModel2 = await this.recruitmentRepo.getByPositionNum(
      teamId,
      positionNum2,
    );
    if (!recModel2) return new BadRequestError('InvalidePosition');
    const newRecModel1 = await this.recruitmentRepo.updatePlayerId(
      recModel1._id.toString(),
      recModel2.playerId.toString(),
    );
    if (!newRecModel1) return new BadRequestError('InvalidePosition');
    const newRecModel2 = await this.recruitmentRepo.updatePlayerId(
      recModel2._id.toString(),
      recModel1.playerId.toString(),
    );
    if (!newRecModel2) return new BadRequestError('InvalidePosition');

    return true;
  }
}
