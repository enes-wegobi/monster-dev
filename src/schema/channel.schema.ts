import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { Statistic, StatisticSchema } from './statistic.schema';
import { VideoStatistic, VideoStatisticSchema } from './video-statistic.schema';
import { ChannelToken, ChannelTokenSchema } from './channel-token.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop()
  channelId: string;

  @Prop({ required: true })
  channelType: ChannelType;

  @Prop({ type: StatisticSchema, required: true })
  statistic: Statistic;

  @Prop({ type: [VideoStatisticSchema] })
  videos: VideoStatistic[];

  @Prop({ type: ChannelTokenSchema, required: true })
  tokenInfo: ChannelToken;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
