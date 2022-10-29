import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Week {
  @Prop({ required: true })
  refId: number;
  @Prop({ required: true })
  weekNum: number;
  @Prop({ required: true })
  endDate: Date;
  @Prop({ required: true })
  deadlineDate: Date;
  @Prop({ required: true })
  isCurrent: boolean;
  @Prop({ required: true })
  isNext: boolean;
  @Prop({ required: true })
  isPrevious: boolean;
  @Prop({ required: true })
  createdAt: Date = new Date();
  @Prop()
  deletedAt?: Date;
}

export const WeekSchema = SchemaFactory.createForClass(Week);
