import { Injectable, Logger } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelType } from 'src/domain/enum/channel-type.enum';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { GoogleClient } from 'src/google/google.client';
import { YoutubeChannelCreateDto } from '../dto/youtube-channel-create.dto';
import { CreateVideoDto } from '../../video/dto/create-video.dto';
import { VideoService } from '../../video/video.service';

@Injectable()
export class YoutubeChannelCreateService {
  private readonly logger = new Logger(YoutubeChannelCreateService.name);

  constructor(
    private channelService: ChannelService,
    private googleClient: GoogleClient,
    private videoService: VideoService,
  ) {}
  async createYoutubeChannel(youtubeChannelCreateDto: YoutubeChannelCreateDto) {
    const { accessToken, image, channelEmail } = youtubeChannelCreateDto;

    const youtubeChannel = await this.googleClient.getChannelInfo(accessToken);
    const {
      id: externalId,
      title: name,
      playlistId,
      totalViewCount,
      totalSubscribers,
      totalVideos,
    } = youtubeChannel;

    const googleVideoIds = await this.googleClient.getVideoIds(
      playlistId,
      accessToken,
    );

    let videoIds: string[];
    if (googleVideoIds.length > 0) {
      videoIds = await this._createVideosFromGoogleVideos(
        googleVideoIds,
        accessToken,
      );
    }

    const channelDto: CreateChannelDto = {
      externalId,
      name,
      channelEmail,
      videos: videoIds,
      image,
      token: {
        accessToken,
      },
      type: ChannelType.YOUTUBE,
      statistic: {
        subscriberCount: totalSubscribers,
        videoCount: totalVideos,
        viewCount: totalViewCount,
      },
    };
    return await this.channelService.create(channelDto);
  }

  private async _createVideosFromGoogleVideos(
    googleVideoIds: string[],
    accessToken: string,
  ) {
    const googleVideos = await this.googleClient.getVideos(
      googleVideoIds,
      accessToken,
    );
    return await this.videoService.createAll(
      this.mapGoogleVideos(googleVideos),
    );
  }

  private mapGoogleVideos(googleVideos: any[]): CreateVideoDto[] {
    return googleVideos.map((googleVideo) => ({
      externalId: googleVideo.videoId,
      viewCount: googleVideo.viewCount,
      likeCount: googleVideo.likeCount,
      dislikeCount: googleVideo.dislikeCount,
      favoriteCount: googleVideo.favoriteCount,
      commentCount: googleVideo.commentCount,
    }));
  }
}
