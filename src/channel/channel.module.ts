import { Module } from '@nestjs/common';
import { ChannelService } from './service/channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../schema/channel.schema';
import { TwitchChannelCreateListener } from './listeners/twitch-channel-create.listener';
import { TwitchModule } from 'src/twitch/twitch.module';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    TwitchModule,
    UsersModule,
  ],
  controllers: [],
  providers: [ChannelService, TwitchChannelCreateListener],
})
export class ChannelModule {}
