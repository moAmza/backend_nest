import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { PlayerRepo } from './player.repo';
import { PlayerDao } from './daos/player.dao';
import { NotFoundError } from 'src/errors/not-found-error';
import { BadRequestError } from 'src/errors/bad-request-error';
import { InGetPaginatedPlayers } from './dtos/in-get-paginated-players.dto';
import { TypePlayerDto } from './dtos/type-player.dto';
import { OutGetPaginatedPlayersDto } from './dtos/out-get-paginated-players.dto';
import { InBulkUpsertPlayerDto } from './dtos/in-bulk-upsert-player.dto';
import { StatsRepo } from './stats.repo';
import { StatsDao } from './daos/stats.dao';
import { WeekService } from '../week/week.service';
import { TypeStatsDto } from './dtos/type-stats.dto';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepo: StatsRepo) {}

  async createStats(
    playerId: string,
    weekId: string,
    score: number,
    price: number,
  ): Promise<TypeStatsDto> {
    const statsModel = await this.statsRepo.createOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      weekId: new mongoose.Types.ObjectId(weekId),
      score,
      price,
      createdAt: new Date(),
    });

    return StatsDao.convertOne(statsModel);
  }

  async getStats(
    playerId: string,
    weekId: string,
  ): Promise<TypeStatsDto | NotFoundError | BadRequestError> {
    const isIdValid =
      mongoose.Types.ObjectId.isValid(playerId) &&
      mongoose.Types.ObjectId.isValid(weekId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const statsModel = await this.statsRepo.getStats(playerId, weekId);
    if (!statsModel) return new NotFoundError('Player');
    const stats = StatsDao.convertOne(statsModel);
    return stats;
  }
}
