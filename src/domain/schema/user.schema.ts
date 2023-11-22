import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Channel } from './channel.schema';

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

  @Prop({ required: true })
  photo: string;

  @Prop()
  hasYoutube: boolean;

  @Prop()
  hasTwitch: boolean;

  @Prop([{ type: Types.ObjectId, ref: Channel, required: false }])
  channels: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
