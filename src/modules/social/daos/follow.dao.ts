import { TypeFollowDto } from '../dtos/type-follow.dto';
import { Follow } from '../follow.schema';

const PROFILE_IMAGE_DEFAULT_PATH = 'uploads/images/small/default.png';
export abstract class FollowDao {
  static convertOne = (model: MongoDoc<Follow>): TypeFollowDto => ({
    followerId: model.followerId.toString(),
    followingId: model.followingId.toString(),
  });
}
