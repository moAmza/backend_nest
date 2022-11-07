import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TypeEventDto } from './dtos/type-event.dto';
import { LikeEvent } from './like-event.schema';

@Injectable()
export class LikeEventRepo {
  constructor(
    @InjectModel(LikeEvent.name) private readonly model: Model<LikeEvent>,
  ) {}

  async createLikeEvent(
    userId: string,
    weekId: string,
    userEventId: string,
  ): Promise<MongoDoc<LikeEvent>> {
    return await this.model.create({
      userId: new mongoose.Types.ObjectId(userId),
      weekId: new mongoose.Types.ObjectId(weekId),
      userEventId: new mongoose.Types.ObjectId(userEventId),
    });
  }

  async removeLikeEvent(
    userId: string,
    weekId: string,
    userEventId: string,
  ): Promise<MongoDoc<LikeEvent> | null> {
    return await this.model.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId),
      weekId: new mongoose.Types.ObjectId(weekId),
      userEventId: new mongoose.Types.ObjectId(userEventId),
    });
  }
}
