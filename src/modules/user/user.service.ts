import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserRepo } from './user.repo';
import { User } from './user.schema';
import { InConfirmDto } from '../auth/dtos/in-confirm.dto';
import { InLoginDto } from '../auth/dtos/in-login.dto';
import { InRegisterDto } from '../auth/dtos/in-register.dto';
import { VerifierRepo } from '../auth/verifier.repo';
import { Verifier } from '../auth/verifier.schema';
import { UserDao } from './daos/user.dao';
import { TypeAuthInfoDto } from './dtos/type-auth-user.dto';
import { TypeFullUserDto } from './dtos/type-full-user.dto';
import { NotFoundError } from 'src/errors/not-found-error';
import { BadRequestError } from 'src/errors/bad-request-error';
import { DuplicateError } from 'src/errors/duplicate-error';
import { InGetPaginatedUsers } from './dtos/in-get-paginated-users.dto';
import { OutGetPaginatedUsersDto } from './dtos/out-get-paginated-users.dto';
import { TypeShortUserDto } from './dtos/type-short-user.dto';
import { UploadService } from '../upload/upload.service';
import { TypeUserDto } from './dtos/type-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly uploadService: UploadService,
  ) {}

  async verifyRegisterInput(
    userInfo: InRegisterDto,
  ): Promise<DuplicateError | true> {
    if (!(await this.isUsernameAvailable(userInfo.username)))
      return new DuplicateError('Username');
    if (!(await this.isEmailAvailable(userInfo.email)))
      return new DuplicateError('Email');

    return true;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const userModel = await this.userRepo.getByUsername(username);

    return !userModel;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const userModel = await this.userRepo.getByEmail(email);

    return !userModel;
  }

  async createUser(
    userInfo: InRegisterDto,
  ): Promise<TypeFullUserDto | DuplicateError> {
    let isInputValid = await this.verifyRegisterInput(userInfo);
    if (isInputValid !== true) return isInputValid;
    const userModel = await this.userRepo.create({
      ...userInfo,
      createdAt: new Date(),
    });
    const userFull = UserDao.convertOneToOutFull(userModel, false, 100);

    return userFull;
  }

  async getAuthInfoByUsername(
    username: string,
  ): Promise<TypeAuthInfoDto | NotFoundError> {
    const userModel = await this.userRepo.getByUsername(username);
    if (!userModel) return new NotFoundError('User');
    return UserDao.convertOneToAuthInfo(userModel);
  }

  async getUserByid(
    paramUserId: string,
  ): Promise<TypeUserDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(paramUserId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const userModel = await this.userRepo.getById(paramUserId);
    if (!userModel) return new NotFoundError('User');
    const user = UserDao.convertOne(userModel);

    return user;
  }

  async getFullUserByid(
    userId: string,
    paramUserId: string,
  ): Promise<TypeFullUserDto | NotFoundError | BadRequestError> {
    const isIdValid =
      mongoose.Types.ObjectId.isValid(paramUserId) &&
      mongoose.Types.ObjectId.isValid(userId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const userModel = await this.userRepo.getById(paramUserId);
    if (!userModel) return new NotFoundError('User');
    const userFull = UserDao.convertOneToOutFull(
      userModel,
      await this.isFollowed(userId, paramUserId),
      100,
    );

    return userFull;
  }

  async getShortUserByid(
    userId: string,
    paramUserId: string,
  ): Promise<TypeShortUserDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(paramUserId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const userModel = await this.userRepo.getById(paramUserId);
    if (!userModel) return new NotFoundError('User');
    const userFull = UserDao.convertOneToOutShort(
      userModel,
      await this.isFollowed(userId, paramUserId),
    );

    return userFull;
  }

  async getPaginatedUsers(
    userId: string,
    { page, num, search }: InGetPaginatedUsers,
  ): Promise<OutGetPaginatedUsersDto> {
    const paginatedUserModels = await this.userRepo.getPaginatedUsers(
      num,
      (page - 1) * num,
      search,
    );
    const res: OutGetPaginatedUsersDto = {
      count: paginatedUserModels.count ?? 0,
      values: await Promise.all(
        paginatedUserModels.values.map(async (model) => {
          return UserDao.convertOneToOutShort(
            model,
            await this.isFollowed(userId, model._id.toString()),
          );
        }),
      ),
    };

    return res;
  }

  async saveAndUpdateProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<TypeShortUserDto | NotFoundError> {
    const image = await this.uploadService.saveMulterImage(userId, file);
    const userModel = await this.userRepo.updateProfileImage(userId, image);
    if (!userModel) return new NotFoundError('User');
    return UserDao.convertOneToOutShort(userModel, false);
  }

  async isFollowed(followerId: string, followingId: string): Promise<boolean> {
    return false;
  }
}
