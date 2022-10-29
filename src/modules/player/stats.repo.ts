import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stats } from './stats.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class StatsRepo {
  constructor(@InjectModel(Stats.name) private readonly model: Model<Stats>) {}

  async createOne(data: Stats): Promise<MongoDoc<Stats>> {
    return await this.model.findOneAndUpdate(
      { weekId: data.weekId, playerId: data.playerId },
      data,
      { upsert: true, new: true },
    );
  }

  async getStats(
    playerId: string,
    weekId: string,
  ): Promise<MongoDoc<Stats> | null> {
    return await this.model.findOne({
      weekId: new mongoose.Types.ObjectId(weekId),
      playerId: new mongoose.Types.ObjectId(playerId),
    });
  }
}
