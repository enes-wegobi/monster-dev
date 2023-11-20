import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  birthdate: string;

  @Prop()
  gender: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  photo: string;

  @Prop()
  twitchChannel: string;

  @Prop()
  youtubeChannel: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
