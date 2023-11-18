import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;


  // other fields
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
