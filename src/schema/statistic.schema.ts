import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatisticDocument = HydratedDocument<Statistic>;

@Schema({ timestamps: true })
export class Statistic {
  @Prop({ required: true, default: 0 })
  videoCount: number;

  @Prop({ required: true, default: 0 })
  viewCount: number;

  @Prop({ required: false, default: 0 })
  subscriberCount: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
