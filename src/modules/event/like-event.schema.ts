import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class LikeEvent {
  @Prop({ required: true })
  userId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  weekId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  userEventId: mongoose.Types.ObjectId;
}

export const LikeEventSchema = SchemaFactory.createForClass(LikeEvent);
