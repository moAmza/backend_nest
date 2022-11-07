import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Week } from './week.schema';

@Injectable()
export class WeekRepo {
  constructor(@InjectModel(Week.name) private readonly model: Model<Week>) {}

  async upsertOne(data: Week): Promise<MongoDoc<Week>> {
    return await this.model.findOneAndUpdate({ refId: data.refId }, data, {
      upsert: true,
      new: true,
    });
  }

  async getCurrentWeek(): Promise<MongoDoc<Week> | null> {
    return await this.model.findOne({ isCurrent: true });
  }

  async getWeekById(id: string): Promise<MongoDoc<Week> | null> {
    return await this.model.findById(id);
  }
}
