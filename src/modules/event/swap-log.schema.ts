import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class SwapLog {
  @Prop({ required: true })
  weekId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  userId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  pastPlayerId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  nextPlayerId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  positionNum1: number;
  @Prop({ required: true })
  positionNum2: number;
}

export const SwapLogSchema = SchemaFactory.createForClass(SwapLog);
