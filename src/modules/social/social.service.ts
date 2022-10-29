import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { FollowRepo } from './follow.repo';
import { NotFoundError } from 'src/errors/not-found-error';
import { BadRequestError } from 'src/errors/bad-request-error';
import { UserService } from '../user/user.service';
import { BaseError } from 'src/errors/base-error';
import { InGetPaginatedFollow } from './dtos/in-get-paginated-follows.dto';
import { OutGetPaginatedFollowsDto } from './dtos/out-get-paginated-follows.dto';
import { FollowDao } from './daos/follow.dao';
import { TypeShortUserDto } from '../user/dtos/type-short-user.dto';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepo: FollowRepo,
    private readonly userService: UserService,
  ) {}

  private async followModelsToShortUsers(
    userId: string,
    userIds: string[],
  ): Promise<TypeShortUserDto[]> {
    return (
      await Promise.all(
        userIds.map(async (uid) => {
          const user = await this.userService.getShortUserByid(userId, uid);
          if (user instanceof BaseError) return null;
          return user;
        }),
      )
    ).reduce<TypeShortUserDto[]>(
      (acc, user) => (user ? [...acc, user] : acc),
      [],
    );
  }

  async unfollow(
    followerId: string,
    followingId: string,
  ): Promise<NotFoundError | BadRequestError | true> {
    const isValid =
      mongoose.Types.ObjectId.isValid(followerId) &&
      mongoose.Types.ObjectId.isValid(followingId);
    if (!isValid) return new BadRequestError('InvalidInputId');
    const deleted = await this.followRepo.deleteOne(followerId, followingId);
    if (deleted === null) return new NotFoundError('User');
    return true;
  }

  async follow(
    userId: string,
    followingId: string,
  ): Promise<NotFoundError | BadRequestError | true> {
    const isValid =
      mongoose.Types.ObjectId.isValid(userId) &&
      mongoose.Types.ObjectId.isValid(followingId);
    if (!isValid) return new BadRequestError('InvalidInputId');
    const follower = await this.userService.getUserByid(userId);
    if (follower instanceof BaseError) return follower;
    const following = await this.userService.getUserByid(followingId);
    if (following instanceof BaseError) return following;
    this.followRepo.createOne({
      followerId: new mongoose.Types.ObjectId(userId),
      followingId: new mongoose.Types.ObjectId(followingId),
      createdAt: new Date(),
    });
    return true;
  }

  async getPaginatedFollowers(
    userId: string,
    { page, num }: InGetPaginatedFollow,
  ): Promise<OutGetPaginatedFollowsDto | BadRequestError> {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) return new BadRequestError('InvalidInputId');
    const paginatedFollowModels = await this.followRepo.getPaginatedFollowers(
      userId,
      num,
      (page - 1) * num,
    );

    const follows = paginatedFollowModels.values.map(FollowDao.convertOne);
    const users = await this.followModelsToShortUsers(
      userId,
      follows.map((f) => f.followerId),
    );

    const res: OutGetPaginatedFollowsDto = {
      count: paginatedFollowModels.count ?? 0,
      values: users,
    };
    return res;
  }

  async getPaginatedFollowings(
    userId: string,
    { page, num }: InGetPaginatedFollow,
  ): Promise<OutGetPaginatedFollowsDto | BadRequestError> {
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid) return new BadRequestError('InvalidInputId');
    const paginatedFollowModels = await this.followRepo.getPaginatedFollowings(
      userId,
      num,
      (page - 1) * num,
    );

    const follows = paginatedFollowModels.values.map(FollowDao.convertOne);
    const users = await this.followModelsToShortUsers(
      userId,
      follows.map((f) => f.followingId),
    );

    const res: OutGetPaginatedFollowsDto = {
      count: paginatedFollowModels.count ?? 0,
      values: users,
    };
    return res;
  }
}
