import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Follow {
  @Prop({ required: true })
  followerId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  followingId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date = new Date();

  @Prop()
  deletedAt?: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
