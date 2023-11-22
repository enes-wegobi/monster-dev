import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { TwitchChannelCreateDto } from '../dto/twitch-channel-create.dto';
import { TwitchClient } from '../../twitch/twitch.client';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { ChannelType } from '../../domain/enum/channel-type.enum';
import { CreateVideoDto } from '../../video/dto/create-video.dto';
import { VideoService } from '../../video/video.service';

@Injectable()
export class TwitchChannelCreateService {
  private readonly logger = new Logger(TwitchChannelCreateService.name);

  constructor(
    private channelService: ChannelService,
    private videoService: VideoService,
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

    const videoIds = await this.videoService.createAll(
      this.mapTwitchVideos(channelInfo.videos),
    );

    const channelDto: CreateChannelDto = {
      externalId,
      name,
      channelEmail,
      image,
      videos: videoIds,
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

  private mapTwitchVideos(twitchVideos: any[]): CreateVideoDto[] {
    return twitchVideos.map((twitchVideo) => ({
      externalId: twitchVideo.id,
      viewCount: twitchVideo.view_count,
    }));
  }
}
