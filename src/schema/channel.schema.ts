import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { Statistic, StatisticSchema } from './statistic.schema';
import { VideoStatistic, VideoStatisticSchema } from './video-statistic.schema';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  channelType: ChannelType;

  @Prop({ type: StatisticSchema, required: true })
  statistic: Statistic;

  @Prop({ type: [VideoStatisticSchema] })
  videos: VideoStatistic[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
