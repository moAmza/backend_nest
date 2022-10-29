import { TypeFullVerifier } from '../dtos/type-full-verifier.dto';
import { Verifier } from '../verifier.schema';

export abstract class VerifierDao {
  static convertOne = (model: MongoDoc<Verifier>): TypeFullVerifier => ({
    id: model._id.toString(),
    code: model.code,
    count: model.count,
    email: model.email,
    userInfo: model.userInfo,
    createdAt: model.createdAt,
    deletedAt: model.deletedAt,
  });
}
