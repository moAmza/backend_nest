import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { PlayerRepo } from './player.repo';
import { PlayerDao } from './daos/player.dao';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { InGetPaginatedPlayers } from './dtos/in-get-paginated-players.dto';
import { TypePlayerDto } from './dtos/type-player.dto';
import { OutGetPaginatedPlayersDto } from './dtos/out-get-paginated-players.dto';
import { InBulkUpsertPlayerDto } from './dtos/in-bulk-upsert-player.dto';
import { StatsDao } from './daos/stats.dao';
import { WeekService } from '../week/week.service';
import { StatsService } from './stats.service';
import { BaseError } from '../../errors/base-error';

@Injectable()
export class PlayerService {
  constructor(
    private readonly playerRepo: PlayerRepo,
    private readonly statsService: StatsService,
    private readonly weekService: WeekService,
  ) {}

  async bulkUpsertPlayers(
    inputs: InBulkUpsertPlayerDto,
  ): Promise<TypePlayerDto[]> {
    return await Promise.all(
      inputs.players.map(async (input) => {
        const playerInput =
          PlayerDao.transformInPlayerUpsertToPlayerSchema(input);
        const playerModel = await this.playerRepo.upsertOne(playerInput);
        const statsModel = await this.statsService.createStats(
          playerModel._id.toString(),
          inputs.weekId,
          input.score,
          input.price,
        );

        return PlayerDao.addStatsToPlayer(playerModel, statsModel);
      }),
    );
  }

  async getPlayerByid(
    playerId: string,
  ): Promise<TypePlayerDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(playerId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const playerModel = await this.playerRepo.getById(playerId);
    if (!playerModel) return new NotFoundError('Player');
    const week = await this.weekService.getCurrentWeek();
    if (week instanceof BaseError) return week;
    const stats = await this.statsService.getStats(playerId, week.id);
    if (stats instanceof BaseError) return stats;
    const player = PlayerDao.addStatsToPlayer(playerModel, stats);
    return player;
  }

  async getPaginatedPlayers({
    page,
    num,
    search,
  }: InGetPaginatedPlayers): Promise<
    OutGetPaginatedPlayersDto | NotFoundError
  > {
    const week = await this.weekService.getCurrentWeek();
    if (week instanceof NotFoundError) return week;
    const paginatedPlayerModels = await this.playerRepo.getPaginatedPlayers(
      num,
      (page - 1) * num,
      search,
      week.id,
    );

    const res: OutGetPaginatedPlayersDto = {
      count: paginatedPlayerModels.count ?? 0,
      values: paginatedPlayerModels.values.map(PlayerDao.convertOne),
    };

    return res;
  }
}
