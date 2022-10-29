import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Team {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  credit: number;
  @Prop({ required: true })
  userId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  createdAt: Date = new Date();
  @Prop()
  deletedAt?: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
