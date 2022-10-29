import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Follow } from './follow.schema';

@Injectable()
export class FollowRepo {
  constructor(
    @InjectModel(Follow.name) private readonly model: Model<Follow>,
  ) {}

  private getPaginationAggregations(skip: number, limit: number) {
    return [
      {
        $facet: {
          values: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: 'count' }],
        },
      },
      { $set: { count: '$count.count' } },
      { $unwind: { path: '$count', preserveNullAndEmptyArrays: true } },
    ];
  }

  async createOne(info: Follow): Promise<MongoDoc<Follow>> {
    return await this.model.create(info);
  }

  async deleteOne(
    followerId: string,
    followingId: string,
  ): Promise<MongoDoc<Follow> | null> {
    return await this.model.findOneAndDelete({
      followerId: new mongoose.Types.ObjectId(followerId),
      followingId: new mongoose.Types.ObjectId(followingId),
    });
  }

  async getByFollowerId(followerId: string): Promise<MongoDoc<Follow> | null> {
    return await this.model.findOne({
      followerId: new mongoose.Types.ObjectId(followerId),
    });
  }

  async getByFollowingId(
    followingId: string,
  ): Promise<MongoDoc<Follow> | null> {
    return await this.model.findOne({
      followingId: new mongoose.Types.ObjectId(followingId),
    });
  }

  async getPaginatedFollowers(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<PaginatedType<MongoDoc<Follow>>> {
    return (
      await this.model.aggregate([
        { $match: { followingId: new mongoose.Types.ObjectId(userId) } },
        ...this.getPaginationAggregations(skip, limit),
      ])
    )[0];
  }

  async getPaginatedFollowings(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<PaginatedType<MongoDoc<Follow>>> {
    return (
      await this.model.aggregate([
        { $match: { followerId: new mongoose.Types.ObjectId(userId) } },
        ...this.getPaginationAggregations(skip, limit),
      ])
    )[0];
  }
}
