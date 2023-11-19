import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Channel, ChannelSchema } from './channel.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthdate: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ default: true })
  canJoin: boolean;

  @Prop()
  photo: string;

  @Prop({ type: [{ type: ChannelSchema, ref: 'Channel' }] })
  channels: Channel[];
}

export const UserSchema = SchemaFactory.createForClass(User);
