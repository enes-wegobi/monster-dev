import { Injectable, Logger } from '@nestjs/common';
import { EventType } from 'src/domain/enum/event.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { TwitchChannelCreateEvent } from 'src/domain/event/twitch-channel-create.event';
import { ChannelService } from '../service/channel.service';
import { TwitchClient } from 'src/twitch/twitch.client';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class TwitchChannelCreateListener {
  private readonly logger = new Logger(TwitchChannelCreateListener.name);

  constructor(
    private channelService: ChannelService,
    private twitchClient: TwitchClient,
    private userService: UserService,
  ) {}

  @OnEvent(EventType.TWITCH_CHANNEL_CREATE)
  async createTwitchChannel(
    twitchChannelCreateEvent: TwitchChannelCreateEvent,
  ) {
    const { accessToken, refreshToken, broadcasterId, userId, channelName } =
      twitchChannelCreateEvent;

    if (!broadcasterId || !refreshToken || !accessToken || !userId) {
      this.logger.error(
        'TWITCH_CHANNEL_CREATE_EVENT there is no broadcasterId refreshToken accessToken userId',
      );
      return;
    }
    this.logger.log(
      'TWITCH_CHANNEL_CREATE_EVENT started for channelName: ' + channelName,
    );
    const doesChannelExist =
      await this.channelService.doesChannelExist(broadcasterId);
    if (doesChannelExist) {
      this.logger.log(
        `TWITCH_CHANNEL_CREATE_EVENT this channel: ${broadcasterId} already exist`,
      );
      return;
    }

    const totalFollowersResponse =
      await this.twitchClient.getChannelTotalFollowers(
        accessToken,
        broadcasterId,
      );

    const channelInfo = await this.twitchClient.getTwitchChannelInfo(
      accessToken,
      broadcasterId,
    );

    if (!totalFollowersResponse || !channelInfo) {
      this.logger.error('TWITCH_CHANNEL_CREATE_EVENT: Unable to fetch data');
      return;
    }

    const channelDto: CreateChannelDto = {
      channelId: broadcasterId,
      name: channelName,
      tokenInfo: {
        accessToken,
        refreshToken,
      },
      channelType: ChannelType.TWITCH,
      statistic: {
        subscriberCount: totalFollowersResponse.total,
        videoCount: channelInfo.totalVideos,
        viewCount: channelInfo.totalViewCount,
      },
    };
    const channel = await this.channelService.create(channelDto);
    if (channel) {
      await this.userService.updateUser(userId, {
        twitchChannel: channel._id.toString(),
      });
      this.logger.log('TWITCH_CHANNEL_CREATE_EVENT Channel created');
    }
  }
}
