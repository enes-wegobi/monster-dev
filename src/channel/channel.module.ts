import { forwardRef, Module } from '@nestjs/common';
import { ChannelService } from './service/channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../domain/schema/channel.schema';
import { TwitchModule } from 'src/twitch/twitch.module';
import { UsersModule } from 'src/users/user.module';
import { GoogleModule } from 'src/google/google.module';
import { YoutubeChannelCreateService } from './service/youtube-channel-create.service';
import { TwitchChannelCreateService } from './service/twitch-channel-create.service';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    TwitchModule,
    GoogleModule,
    forwardRef(() => UsersModule),
    VideoModule,
  ],
  exports: [
    ChannelService,
    YoutubeChannelCreateService,
    TwitchChannelCreateService,
  ],
  providers: [
    ChannelService,
    YoutubeChannelCreateService,
    TwitchChannelCreateService,
  ],
})
export class ChannelModule {}
