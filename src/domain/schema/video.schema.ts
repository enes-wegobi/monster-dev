import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VideoDocument = HydratedDocument<Video>;

@Schema({ timestamps: true })
export class Video {
  @Prop()
  externalId: string;

  @Prop()
  viewCount: number;

  @Prop()
  likeCount: number;

  @Prop()
  dislikeCount: number;

  @Prop()
  favoriteCount: number;

  @Prop()
  commentCount: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
