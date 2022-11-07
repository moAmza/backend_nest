import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TypeEventDto } from './dtos/type-event.dto';
import { EventLog } from './event-log.schema';

@Injectable()
export class EventLogRepo {
  constructor(
    @InjectModel(EventLog.name) private readonly model: Model<EventLog>,
  ) {}

  async createEventLog(
    userId: string,
    weekId: string,
    pastPlayerId: string,
    nextPlayerId: string,
    positionNum1: number,
    positionNum2: number,
  ): Promise<MongoDoc<EventLog>> {
    return await this.model.create({
      userId: new mongoose.Types.ObjectId(userId),
      weekId: new mongoose.Types.ObjectId(weekId),
      pastPlayerId: new mongoose.Types.ObjectId(pastPlayerId),
      nextPlayerId: new mongoose.Types.ObjectId(nextPlayerId),
      positionNum1,
      positionNum2,
    });
  }

  async getEvents(
    userIds: mongoose.Types.ObjectId[],
    skip: number,
    limit: number,
  ): Promise<PaginatedType<TypeEventDto>> {
    return (
      await this.model.aggregate([
        { $match: { userId: { $in: userIds } } },
        {
          $group: {
            _id: { userId: '$userId', weekId: '$weekId' },
            swaps: {
              $push: {
                pastPlayerId: '$pastPlayerId',
                nextPlayerId: '$nextPlayerId',
                positionNum1: '$positionNum1',
                positionNum2: '$positionNum2',
              },
            },
          },
        },
        { $sort: { '_id.weekId': 1 } },
        {
          $facet: {
            count: [{ $count: 'count' }],
            values: [{ $skip: skip }, { $limit: limit }],
          },
        },
        { $set: { count: '$count.count' } },
        { $unwind: { path: '$count', preserveNullAndEmptyArrays: true } },
      ])
    )[0];
  }
}
