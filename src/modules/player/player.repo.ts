import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Player } from './player.schema';

@Injectable()
export class PlayerRepo {
  constructor(
    @InjectModel(Player.name) private readonly model: Model<Player>,
  ) {}

  async upsertOne(data: Player): Promise<MongoDoc<Player>> {
    return await this.model.findOneAndUpdate({ refId: data.refId }, data, {
      upsert: true,
      new: true,
    });
  }

  async getById(playerId: string): Promise<MongoDoc<Player> | null> {
    return await this.model.findById(new mongoose.Types.ObjectId(playerId));
  }

  async getPaginatedPlayers(
    limit: number,
    skip: number,
    search: string,
    role: string,
    weekId: string,
  ): Promise<PaginatedType<PopulatedWithStats<MongoDoc<Player>>>> {
    return (
      await this.model.aggregate([
        { $match: role === 'all' ? {} : { role: role } },
        {
          $match: {
            $or: [
              { firstName: new RegExp(search, 'i') },
              { lastName: new RegExp(search, 'i') },
              { webname: new RegExp(search, 'i') },
            ],
          },
        },
        {
          $lookup: {
            from: 'stats',
            as: 'playerStats',
            localField: '_id',
            foreignField: 'playerId',
            pipeline: [
              { $match: { weekId: new mongoose.Types.ObjectId(weekId) } },
            ],
          },
        },
        { $unwind: '$playerStats' },
        {
          $facet: {
            values: [{ $skip: skip }, { $limit: limit }],
            count: [{ $count: 'count' }],
          },
        },
        { $set: { count: '$count.count' } },
        { $unwind: { path: '$count', preserveNullAndEmptyArrays: true } },
      ])
    )[0];
  }
}
