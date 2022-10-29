import { TypeFullUserDto } from '../dtos/type-full-user.dto';
import { TypeShortUserDto } from '../dtos/type-short-user.dto';
import { TypeAuthInfoDto } from '../dtos/type-auth-user.dto';
import { TypeUserDto } from '../dtos/type-user.dto';
import { User } from '../user.schema';

const IMAGE_PATH_PREFIX = 'uploads/images/small/';
const PROFILE_IMAGE_DEFAULT_PATH = 'default.png';
export abstract class UserDao {
  private static createProfileImagePath = (profileImage?: string) =>
    IMAGE_PATH_PREFIX + (profileImage ?? PROFILE_IMAGE_DEFAULT_PATH);

  static convertOne = (model: MongoDoc<User>): TypeUserDto => ({
    id: model._id.toString(),
    username: model.username,
    firstname: model.firstname,
    lastname: model.lastname,
    email: model.email,
    birthday: model.birthday,
    country: model.country,
    profileImage: this.createProfileImagePath(model.profileImage),
    createdAt: model.createdAt,
  });

  static convertOneToOutShort = (
    model: MongoDoc<User>,
    isFollowed: boolean,
  ): TypeShortUserDto => ({
    id: model._id.toString(),
    username: model.username,
    firstname: model.firstname,
    lastname: model.lastname,
    profileImage: this.createProfileImagePath(model.profileImage),
    isFollowed,
    age: new Date().getDate() - model.birthday.getDate(),
  });

  static convertOneToOutFull = (
    model: MongoDoc<User>,
    isFollowed: boolean,
    score: number,
  ): TypeFullUserDto => ({
    ...this.convertOneToOutShort(model, isFollowed),
    email: model.email,
    birthday: model.birthday,
    country: model.country,
    score: score,
    createdAt: model.createdAt,
  });

  static convertOneToAuthInfo = (model: MongoDoc<User>): TypeAuthInfoDto => ({
    id: model._id.toString(),
    username: model.username,
    password: model.password,
  });
}
