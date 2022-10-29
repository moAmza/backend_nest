import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Recruitment } from './recruitment.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RecruitmentRepo {
  constructor(
    @InjectModel(Recruitment.name) private readonly model: Model<Recruitment>,
  ) {}

  async createOne(data: Recruitment): Promise<MongoDoc<Recruitment>> {
    return await this.model.create(data);
  }

  async removeOne(
    teamId: mongoose.Types.ObjectId,
    positionNum: number,
  ): Promise<MongoDoc<Recruitment> | null> {
    return await this.model.findOneAndDelete({ teamId, positionNum });
  }

  async getByPositionNum(
    teamId: string,
    positionNum: number,
  ): Promise<MongoDoc<Recruitment> | null> {
    return await this.model.findOne({
      teamId: new mongoose.Types.ObjectId(teamId),
      positionNum,
    });
  }

  async updatePlayerId(recruitmentId: string, playerId: string) {
    return await this.model.findByIdAndUpdate(
      new mongoose.Types.ObjectId(recruitmentId),
      { $set: { playerId: new mongoose.Types.ObjectId(playerId) } },
      { new: true },
    );
  }
}
