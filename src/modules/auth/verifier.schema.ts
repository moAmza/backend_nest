import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InRegisterDto } from './dtos/in-register.dto';

@Schema()
export class Verifier {
  @Prop({ required: true })
  code: number;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  userInfo: InRegisterDto;

  @Prop({ required: true })
  createdAt: Date = new Date();

  @Prop()
  deletedAt?: Date;
}

export const VerifierSchema = SchemaFactory.createForClass(Verifier);
