import { Module } from '@nestjs/common';
import { ChannelService } from './service/channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../schema/channel.schema';
import { TwitchChannelCreateListener } from './listeners/twitch-channel-create.listener';
import { TwitchModule } from 'src/twitch/twitch.module';
import { UsersModule } from 'src/users/user.module';
import { YoutubeChannelCreateListener } from './listeners/youtube-channel-create.listener';
import { GoogleModule } from 'src/google/google.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    TwitchModule,
    GoogleModule,
    UsersModule,
  ],
  controllers: [],
  providers: [ChannelService, TwitchChannelCreateListener, YoutubeChannelCreateListener],
})
export class ChannelModule {}
