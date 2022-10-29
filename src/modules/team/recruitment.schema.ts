import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Recruitment {
  @Prop({ required: true })
  positionNum: number;
  @Prop({ required: true })
  isPlaying: boolean;
  @Prop({ required: true })
  playerId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  teamId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  createdAt: Date = new Date();
  @Prop()
  deletedAt?: Date;
}

export const RecruitmentSchema = SchemaFactory.createForClass(Recruitment);
