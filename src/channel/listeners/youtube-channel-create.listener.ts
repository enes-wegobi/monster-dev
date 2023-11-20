import { Injectable, Logger } from '@nestjs/common';
import { EventType } from 'src/domain/enum/event.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { ChannelService } from '../service/channel.service';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { CreateChannelDto, VideoStatisticDto } from '../dto/create-channel.dto';
import { UserService } from 'src/users/user.service';
import { GoogleClient } from 'src/google/google.client';
import { YoutubeChannelCreateEvent } from 'src/domain/event/youtube-channel-create.event';

@Injectable()
export class YoutubeChannelCreateListener {
  private readonly logger = new Logger(YoutubeChannelCreateListener.name);

  constructor(
    private channelService: ChannelService,
    private googleClient: GoogleClient,
    private userService: UserService,
  ) {}

  @OnEvent(EventType.YOUTUBE_CHANNEL_CREATE)
  async createYoutubeChannel(
    youtubeChannelCreateEvent: YoutubeChannelCreateEvent,
  ) {
    const { accessToken, userId, email } = youtubeChannelCreateEvent;
    if (!accessToken || !userId) {
      this.logger.error(
        'YOUTUBE_CHANNEL_CREATE_EVENT there is no accessToken userId',
      );
      return;
    }
    this.logger.log('YOUTUBE_CHANNEL_CREATE_EVENT started for email: ' + email);
    const youtubeChannel = await this.googleClient.getChannelInfo(accessToken);
    console.log(youtubeChannel);
    const {
      title,
      playlistId,
      totalViewCount,
      totalSubscribers,
      totalVideos,
    } = youtubeChannel;

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
    const channel = await this.channelService.create(channelDto);
    if (channel) {
      await this.userService.updateUser(userId, {
        youtubeChannel: channel._id.toString(),
      });
      this.logger.log('YOUTUBE_CHANNEL_CREATE_EVENT Channel created');
    }
  }
}
