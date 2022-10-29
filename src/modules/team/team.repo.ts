import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Team } from './team.schema';

@Injectable()
export class TeamRepo {
  constructor(@InjectModel(Team.name) private readonly model: Model<Team>) {}

  async createOne(data: Team): Promise<MongoDoc<Team>> {
    return await this.model.create(data);
  }

  async incrementCredit(
    teamId: string,
    amount: number,
  ): Promise<MongoDoc<Team> | null> {
    return await this.model.findByIdAndUpdate(
      new mongoose.Types.ObjectId(teamId),
      { $inc: { credit: amount } },
      { new: true },
    );
  }

  async getByUserId(
    userId: string,
  ): Promise<PopulatedWithRecruitments<MongoDoc<Team>> | null> {
    return (
      await this.model.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'recruitments',
            localField: '_id',
            foreignField: 'teamId',
            as: 'recruitments',
          },
        },
      ])
    )[0];
  }

  // async getPaginatedPlayers(
  //   limit: number,
  //   skip: number,
  //   search: string,
  //   weekId: string,
  // ): Promise<PaginatedType<PopulatedWithStats<MongoDoc<Team>>>> {
  //   return (
  //     await this.model.aggregate([
  //       {
  //         $match: {
  //           $or: [
  //             { firstName: new RegExp(search, 'i') },
  //             { lastName: new RegExp(search, 'i') },
  //             { webname: new RegExp(search, 'i') },
  //           ],
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'stats',
  //           as: 'playerStats',
  //           localField: '_id',
  //           foreignField: 'playerId',
  //           pipeline: [
  //             { $match: { weekId: new mongoose.Types.ObjectId(weekId) } },
  //           ],
  //         },
  //       },
  //       { $unwind: '$playerStats' },
  //       {
  //         $facet: {
  //           values: [{ $skip: skip }, { $limit: limit }],
  //           count: [{ $count: 'count' }],
  //         },
  //       },
  //       { $set: { count: '$count.count' } },
  //       { $unwind: { path: '$count', preserveNullAndEmptyArrays: true } },
  //     ])
  //   )[0];
  // }
}
