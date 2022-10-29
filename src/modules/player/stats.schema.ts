import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Stats {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  playerId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  weekId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date = new Date();

  @Prop()
  deletedAt?: Date;
}

export const StatsSchema = SchemaFactory.createForClass(Stats);
