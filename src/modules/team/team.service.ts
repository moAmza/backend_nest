import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { TeamRepo } from './team.repo';
import { TeamDao } from './daos/team.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { TypeTeamDto } from './dtos/type-team.dto';
import { RecruitmentDao } from './daos/recruitment.dao';
import { BaseError } from '../../errors/base-error';
import { RecruitmentService } from './recruitment.service';
import { PlayerService } from '../player/player.service';
import { EventService } from '../event/event.service';

@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepo: TeamRepo,
    private readonly playerService: PlayerService,
    private readonly recruitService: RecruitmentService,
    private readonly eventService: EventService,
  ) {}

  async createTeam(
    userId: string,
    teamName: string,
  ): Promise<BadRequestError | TypeTeamDto> {
    const isIdValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const teamModel = await this.teamRepo.createOne({
      name: teamName,
      userId: new mongoose.Types.ObjectId(userId),
      credit: 1000,
      createdAt: new Date(),
    });
    const team = TeamDao.convertOne(teamModel, []);
    return team;
  }

  async getTeamByUserId(
    userId: string,
  ): Promise<TypeTeamDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const teamModel = await this.teamRepo.getByUserId(userId);
    if (!teamModel) return new NotFoundError('Team');
    const recruitments = teamModel.recruitments.map(RecruitmentDao.convertOne);
    const players = await this.recruitService.getPlayersFromRecruitments(
      recruitments,
    );
    if (players instanceof BaseError) return players;
    const team = TeamDao.convertOne(teamModel, players);
    return team;
  }

  async addPlayerToTeam(
    userId: string,
    playerId: string,
    positionNum: number,
  ): Promise<TypeTeamDto | NotFoundError | BadRequestError> {
    const isIdValid =
      mongoose.Types.ObjectId.isValid(userId) &&
      mongoose.Types.ObjectId.isValid(playerId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const team = await this.getTeamByUserId(userId);
    if (team instanceof BaseError) return team;
    if (team.players.find((p) => p.id === playerId))
      return new BadRequestError('DuplicatePlayer');
    const player = await this.playerService.getPlayerByid(playerId);
    if (player instanceof BaseError) return player;
    const playersInSameClub = team.players.filter(
      (p) => p.club === player.club,
    );
    if (playersInSameClub.length > 3)
      return new BadRequestError('MoreThanClubLimit');
    const playersWithSameRole = team.players.filter(
      (p) => p.positionNum !== positionNum && p.role === player.role,
    );
    switch (player.role) {
      case 'Goalkeepers':
        if (positionNum > 1) return new BadRequestError('InvalidePosition');
        if (playersWithSameRole.length > 1)
          return new BadRequestError('MoreThanRoleLimit');
        break;
      case 'Defenders':
        if (positionNum < 2 || 6 < positionNum)
          return new BadRequestError('InvalidePosition');
        if (playersWithSameRole.length > 4)
          return new BadRequestError('MoreThanRoleLimit');
        break;
      case 'Midfielders':
        if (positionNum < 7 || 11 < positionNum)
          return new BadRequestError('InvalidePosition');
        if (playersWithSameRole.length > 4)
          return new BadRequestError('MoreThanRoleLimit');
        break;
      case 'Forwards':
        if (positionNum < 12 || 14 < positionNum)
          return new BadRequestError('InvalidePosition');
        if (playersWithSameRole.length > 2)
          return new BadRequestError('MoreThanRoleLimit');
        break;
    }
    const currentPlayerInPosition =
      await this.recruitService.getTeamPlayerByPositionNum(
        team.id,
        positionNum,
      );
    const currentPlayerPrice =
      currentPlayerInPosition instanceof BaseError
        ? 0
        : currentPlayerInPosition.playerStats.price;
    if (team.credit + currentPlayerPrice < player.playerStats.price)
      return new BadRequestError('LowCredit');
    await this.removePlayerFromTeam(userId, positionNum);
    await this.teamRepo.incrementCredit(team.id, -1 * player.playerStats.price);
    await this.recruitService.createOne(team, playerId, positionNum);
    const newTeam = await this.getTeamByUserId(userId);
    return newTeam;
  }

  async removePlayerFromTeam(
    userId: string,
    positionNum: number,
  ): Promise<TypeTeamDto | NotFoundError | BadRequestError> {
    const team = await this.getTeamByUserId(userId);
    if (team instanceof BaseError) return team;
    const player = await this.recruitService.getTeamPlayerByPositionNum(
      team.id,
      positionNum,
    );
    if (player instanceof BaseError) return player;
    const removed = await this.recruitService.removeOne(team, positionNum);
    if (removed !== true) return removed;
    await this.teamRepo.incrementCredit(team.id, player.playerStats.price);
    const newTeam = await this.getTeamByUserId(userId);
    return newTeam;
  }

  async swapTeamPlayers(
    userId: string,
    positionNum1: number,
    positionNum2: number,
  ): Promise<TypeTeamDto | NotFoundError | BadRequestError> {
    const team = await this.getTeamByUserId(userId);
    if (team instanceof BaseError) return team;
    const player1 = await this.recruitService.getTeamPlayerByPositionNum(
      team.id,
      positionNum1,
    );
    if (player1 instanceof BaseError) return player1;
    const player2 = await this.recruitService.getTeamPlayerByPositionNum(
      team.id,
      positionNum2,
    );
    if (player2 instanceof BaseError) return player2;
    if (player1.role !== player2.role)
      return new BadRequestError('DifferentRole');
    await this.recruitService.swapPlayerIds(
      team.id,
      positionNum1,
      positionNum2,
    );
    await this.createNewSwapLog(
      userId,
      player1.id,
      player2.id,
      positionNum1,
      positionNum2,
    );
    return await this.getTeamByUserId(userId);
  }

  async createNewSwapLog(
    userId: string,
    pastPlayerId: string,
    nextPlayerId: string,
    positionNum1: number,
    positionNum2: number,
  ) {
    this.eventService.createEventLog(
      userId,
      pastPlayerId,
      nextPlayerId,
      positionNum1,
      positionNum2,
    );
  }
}
