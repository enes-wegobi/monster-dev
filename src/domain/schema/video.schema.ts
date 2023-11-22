import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true })
  externalId: string;

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

export const VideoSchema = SchemaFactory.createForClass(Video);
