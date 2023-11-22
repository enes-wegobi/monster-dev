import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { TwitchChannelCreateDto } from '../dto/twitch-channel-create.dto';
import { TwitchClient } from '../../twitch/twitch.client';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { ChannelType } from '../../domain/enum/channel-type.enum';

@Injectable()
export class TwitchChannelCreateService {
  private readonly logger = new Logger(TwitchChannelCreateService.name);

  constructor(
    private channelService: ChannelService,
    private twitchClient: TwitchClient,
  ) {}

  async createTwitchChannel(twitchChannelCreateDto: TwitchChannelCreateDto) {
    const { accessToken, refreshToken, externalId, name, image, channelEmail } =
      twitchChannelCreateDto;

    const totalFollowersResponse =
      await this.twitchClient.getChannelTotalFollowers(accessToken, externalId);
    const channelInfo = await this.twitchClient.getTwitchChannelInfo(
      accessToken,
      externalId,
    );

    if (!totalFollowersResponse || !channelInfo) {
      this.logger.error('TWITCH_CHANNEL_CREATE_EVENT: Unable to fetch data');
      return;
    }

    const channelDto: CreateChannelDto = {
      externalId,
      name,
      channelEmail,
      image,
      token: {
        accessToken,
        refreshToken,
      },
      type: ChannelType.TWITCH,
      statistic: {
        subscriberCount: totalFollowersResponse.total,
        videoCount: channelInfo.totalVideos,
        viewCount: channelInfo.totalViewCount,
      },
    };

    return await this.channelService.create(channelDto);
  }
}
