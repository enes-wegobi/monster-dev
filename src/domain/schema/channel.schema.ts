import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { Statistic, StatisticSchema } from './statistic.schema';
import { Token, TokenSchema } from './token.schema';
import { Video } from './video.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop()
  externalId: string;

  @Prop()
  image: string;

  @Prop()
  channelEmail: string;

  @Prop({ required: true })
  type: ChannelType;

  @Prop({ type: StatisticSchema, required: true })
  statistic: Statistic;

  @Prop([{ type: Types.ObjectId, ref: Video, required: false }])
  videos: Types.ObjectId[];

  @Prop({ type: TokenSchema, required: true })
  token: Token;

  @Prop({ default: false })
  isChannelConnectUser: boolean;

  @Prop()
  userId: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
