import { TypeTeamDto } from '../dtos/type-team.dto';
import { Team } from '../team.schema';
import { Recruitment } from '../recruitment.schema';
import { RecruitmentDao } from './recruitment.dao';
import { TypePlayerDto } from 'src/modules/player/dtos/type-player.dto';
import { TypeTeamPlayerDto } from '../dtos/type-team-player.dto';

export abstract class TeamDao {
  // static addStatsToPlayer = (
  //   playerModel: MongoDoc<Team>,
  //   statsModel: MongoDoc<Recruitment>,
  // ): TypePlayerDto => ({
  //   id: playerModel._id.toString(),
  //   refId: playerModel.refId,
  //   firstName: playerModel.firstName,
  //   secondName: playerModel.secondName,
  //   webname: playerModel.webname,
  //   club: playerModel.club,
  //   role: playerModel.role,
  //   playerStats: StatsDao.convertOne(statsModel),
  //   createdAt: playerModel.createdAt,
  // });
  static convertOne = (
    model: MongoDoc<Team>,
    players: TypeTeamPlayerDto[],
  ): TypeTeamDto => ({
    id: model._id.toString(),
    name: model.name,
    credit: model.credit,
    userId: model.userId.toString(),
    players: players,
  });
  // static convertOneWitStats = (
  //   model: PopulatedWithStats<MongoDoc<Team>>,
  // ): TypePlayerDto => ({
  //   id: model._id.toString(),
  //   refId: model.refId,
  //   firstName: model.firstName,
  //   secondName: model.secondName,
  //   webname: model.webname,
  //   club: model.club,
  //   role: model.role,
  //   playerStats: StatsDao.convertOne(model.playerStats),
  //   createdAt: model.createdAt,
  // });
  // static transformInPlayerUpsertToPlayerSchema(input: InPlayerUpsertDto): Team {
  //   return {
  //     refId: input.refId,
  //     firstName: input.firstName,
  //     secondName: input.secondName,
  //     webname: input.webname,
  //     club: input.club ?? '-',
  //     role: input.role,
  //     createdAt: new Date(),
  //   };
  // }
}
