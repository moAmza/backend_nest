import mongoose from 'mongoose';
import { InPlayerUpsertDto } from '../dtos/in-player-upsert.dto';
import { TypeStatsDto } from '../dtos/type-stats.dto';
import { Player } from '../player.schema';
import { Stats } from '../stats.schema';

export abstract class StatsDao {
  static convertOne = (model: MongoDoc<Stats>): TypeStatsDto => ({
    id: model._id.toString(),
    price: model.price,
    score: model.score,
  });
}
