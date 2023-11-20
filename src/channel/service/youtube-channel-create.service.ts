import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { CreateChannelDto, VideoStatisticDto } from '../dto/create-channel.dto';
import { GoogleClient } from 'src/google/google.client';
import { YoutubeChannelCreateDto } from '../dto/youtube-channel-create.dto';

@Injectable()
export class YoutubeChannelCreateService {
  private readonly logger = new Logger(YoutubeChannelCreateService.name);

  constructor(
    private channelService: ChannelService,
    private googleClient: GoogleClient,
  ) {}
  async createYoutubeChannel(youtubeChannelCreateDto: YoutubeChannelCreateDto) {
    const { accessToken, picture, email } = youtubeChannelCreateDto;
    if (!accessToken) {
      this.logger.error('YOUTUBE_CHANNEL_CREATE_EVENT there is no accessToken');
      return;
    }
    const youtubeChannel = await this.googleClient.getChannelInfo(accessToken);
    const { title, playlistId, totalViewCount, totalSubscribers, totalVideos } =
      youtubeChannel;

    const videoIds = await this.googleClient.getVideoIds(
      playlistId,
      accessToken,
    );
    const videos: VideoStatisticDto[] = [];
    if (videoIds.length > 0) {
      const videosStatistics = await this.googleClient.getVideoStatistics(
        videoIds,
        accessToken,
      );

      videosStatistics.forEach((videosStatistic) => {
        videos.push({
          channelId: videosStatistic.videoId,
          viewCount: videosStatistic.viewCount,
          likeCount: videosStatistic.likeCount,
          dislikeCount: videosStatistic.dislikeCount,
          favoriteCount: videosStatistic.favoriteCount,
          commentCount: videosStatistic.commentCount,
        });
      });
    }
    const channelDto: CreateChannelDto = {
      channelId: '123',
      name: title,
      channelEmail: email,
      channelImage: picture,
      videos: videos,
      tokenInfo: {
        accessToken,
      },
      channelType: ChannelType.YOUTUBE,

      statistic: {
        subscriberCount: totalSubscribers,
        videoCount: totalVideos,
        viewCount: totalViewCount,
      },
    };
    return await this.channelService.create(channelDto);
  }
}
