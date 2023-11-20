import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoStatisticDocument = HydratedDocument<VideoStatistic>;

@Schema({ timestamps: true })
export class VideoStatistic {
  @Prop({ required: true })
  channelId: string;

  @Prop({ required: true, default: 0 })
  viewCount: number;

  @Prop({ required: true, default: 0 })
  likeCount: number;

  @Prop({ required: true, default: 0 })
  dislikeCount: number;

  @Prop({ required: true, default: 0 })
  favoriteCount: number;

  @Prop({ required: true, default: 0 })
  commentCount: number;
}

export const VideoStatisticSchema =
  SchemaFactory.createForClass(VideoStatistic);
