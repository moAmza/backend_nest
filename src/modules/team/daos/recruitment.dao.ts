import { Recruitment } from '../recruitment.schema';
import { TypeRecruitmentDto } from '../dtos/type-recruitment.dto';
import { TypePlayerDto } from 'src/modules/player/dtos/type-player.dto';
import { TypeTeamPlayerDto } from '../dtos/type-team-player.dto';

export abstract class RecruitmentDao {
  static convertOne = (model: MongoDoc<Recruitment>): TypeRecruitmentDto => ({
    positionNum: model.positionNum,
    isPlaying: model.isPlaying,
    playerId: model.playerId.toString(),
    teamId: model.teamId.toString(),
  });

  static transformPlayerToTeamPlayer = (
    recruitment: TypeRecruitmentDto,
    player: TypePlayerDto,
  ): TypeTeamPlayerDto => ({
    ...player,
    isPlaying: recruitment.isPlaying,
    positionNum: recruitment.positionNum,
  });
  // static transformInPlayerUpsertToStatsSchema(
  //   input: InPlayerUpsertDto,
  //   playerId: string,
  //   weekId: string,
  // ): Recruitment {
  //   return {
  //     playerId: new mongoose.Types.ObjectId(playerId),
  //     weekId: new mongoose.Types.ObjectId(weekId),
  //     price: input.price,
  //     score: input.score,
  //     createdAt: new Date(),
  //   };
  // }
}
