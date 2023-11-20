import { Injectable, Logger } from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { TwitchChannelCreateDto } from "../dto/twitch-channel-create.dto";
import { TwitchClient } from "../../twitch/twitch.client";
import { CreateChannelDto } from "../dto/create-channel.dto";
import { ChannelType } from "../../domain/enum/channel-type.enum";

@Injectable()
export class TwitchChannelCreateService {
  private readonly logger = new Logger(TwitchChannelCreateService.name);

  constructor(
    private channelService: ChannelService,
    private twitchClient: TwitchClient,
  ) {}

  async createTwitchChannel(twitchChannelCreateDto: TwitchChannelCreateDto) {
    const { accessToken, refreshToken, broadcasterId, userId, channelName } =
      twitchChannelCreateDto;
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

    return await this.channelService.create(channelDto);
  }
}
