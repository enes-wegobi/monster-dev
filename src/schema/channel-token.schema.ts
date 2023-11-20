import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChannelTokenDocument = HydratedDocument<ChannelToken>;

@Schema({ timestamps: true, _id: false })
export class ChannelToken {
  @Prop({ required: true })
  accessToken: string;

  @Prop()
  refreshToken: string;
}

export const ChannelTokenSchema = SchemaFactory.createForClass(ChannelToken);
