import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Player {
  @Prop({ required: true })
  refId: number;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  secondName: string;
  @Prop({ required: true })
  webname: string;
  @Prop({ required: true })
  club: string;
  @Prop({ required: true })
  role: PlayerRolesType;
  @Prop({ required: true })
  createdAt: Date = new Date();
  @Prop()
  deletedAt?: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
