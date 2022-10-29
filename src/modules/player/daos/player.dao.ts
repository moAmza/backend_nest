import { InPlayerUpsertDto } from '../dtos/in-player-upsert.dto';
import { TypePlayerDto } from '../dtos/type-player.dto';
import { TypeStatsDto } from '../dtos/type-stats.dto';
import { Player } from '../player.schema';
import { Stats } from '../stats.schema';
import { StatsDao } from './stats.dao';

export abstract class PlayerDao {
  static addStatsToPlayer = (
    playerModel: MongoDoc<Player>,
    stats: TypeStatsDto,
  ): TypePlayerDto => ({
    id: playerModel._id.toString(),
    refId: playerModel.refId,
    firstName: playerModel.firstName,
    secondName: playerModel.secondName,
    webname: playerModel.webname,
    club: playerModel.club,
    role: playerModel.role,
    playerStats: stats,
    createdAt: playerModel.createdAt,
  });

  static convertOne = (
    model: PopulatedWithStats<MongoDoc<Player>>,
  ): TypePlayerDto => ({
    id: model._id.toString(),
    refId: model.refId,
    firstName: model.firstName,
    secondName: model.secondName,
    webname: model.webname,
    club: model.club,
    role: model.role,
    playerStats: StatsDao.convertOne(model.playerStats),
    createdAt: model.createdAt,
  });

  static convertOneWitStats = (
    model: PopulatedWithStats<MongoDoc<Player>>,
  ): TypePlayerDto => ({
    id: model._id.toString(),
    refId: model.refId,
    firstName: model.firstName,
    secondName: model.secondName,
    webname: model.webname,
    club: model.club,
    role: model.role,
    playerStats: StatsDao.convertOne(model.playerStats),
    createdAt: model.createdAt,
  });

  static transformInPlayerUpsertToPlayerSchema(
    input: InPlayerUpsertDto,
  ): Player {
    return {
      refId: input.refId,
      firstName: input.firstName,
      secondName: input.secondName,
      webname: input.webname,
      club: input.club ?? '-',
      role: input.role,
      createdAt: new Date(),
    };
  }
}
