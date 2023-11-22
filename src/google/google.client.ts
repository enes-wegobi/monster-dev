import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  CHANEL_PART,
  CHANNEL_URL,
  CONTENT_DETAILS,
  PLAYLIST_URL,
  STATISTICS,
  USER_INFO_URL,
  VIDEO_URL,
  YOUTUBE_BASE_URL,
  YOUTUBE_OAUTH2_URL,
} from './google-api.constant';
import {
  APPLICATION_JSON,
  BEARER,
  CHUNK_SIZE,
  GOOGLE,
} from '../domain/model/contstant';
import {
  ERROR_CHANNEL_NOT_FOUND,
  ERROR_GET_CHANNEL_INFO,
  ERROR_GET_USER_INFO,
  ERROR_GET_VIDEO_IDS,
  ERROR_GET_VIDEOS,
} from '../domain/model/exception.constant';

@Injectable()
export class GoogleClient {
  private readonly logger = new Logger(GoogleClient.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getChannelInfo(accessToken: string) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(YOUTUBE_BASE_URL + CHANNEL_URL, {
          params: {
            part: CHANEL_PART,
            key: apiKey,
            mine: true,
          },
          headers: this.getHeader(accessToken),
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error.response.data || GOOGLE + ERROR_GET_CHANNEL_INFO,
            );
            throw new Error(GOOGLE + ERROR_GET_CHANNEL_INFO);
          }),
        ),
    );

    const channelInfo = data.items[0];
    if (!channelInfo) {
      throw new Error(GOOGLE + ERROR_CHANNEL_NOT_FOUND);
    }

    const {
      id,
      snippet: { thumbnails, title },
      contentDetails: { relatedPlaylists },
    } = channelInfo;
    const { viewCount, subscriberCount, videoCount } = channelInfo.statistics;
    const { uploads: playlistId } = relatedPlaylists;

    return {
      id,
      title,
      playlistId,
      image: thumbnails.default.url,
      totalViewCount: +viewCount,
      totalSubscribers: +subscriberCount,
      totalVideos: +videoCount,
    };
  }

  async getVideoIds(playlistId: string, accessToken: string) {
    if (!playlistId) {
      return;
    }
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

    const videoIds: string[] = [];

    let nextPageToken: string | undefined = undefined;

    do {
      const response = await firstValueFrom(
        this.httpService
          .get<any>(YOUTUBE_BASE_URL + PLAYLIST_URL, {
            params: {
              part: CONTENT_DETAILS,
              key: apiKey,
              playlistId: playlistId,
              maxResults: 50,
              pageToken: nextPageToken,
            },
            headers: this.getHeader(accessToken),
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                error.response.data || GOOGLE + ERROR_GET_VIDEO_IDS,
              );
              throw new Error(GOOGLE + ERROR_GET_VIDEO_IDS);
            }),
          ),
      );

      const items = response.data.items;
      if (items) {
        items.forEach((item: any) => {
          const videoId = item.contentDetails.videoId;
          videoIds.push(videoId);
        });
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return videoIds;
  }
  async getVideos(videoIds: string[], accessToken: string) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    const videoStatistics: any[] = [];
    for (let i = 0; i < videoIds.length; i += CHUNK_SIZE) {
      const videoIdsChunk = videoIds.slice(i, i + CHUNK_SIZE);
      const response = await firstValueFrom(
        this.httpService
          .get<any>(YOUTUBE_BASE_URL + VIDEO_URL, {
            params: {
              part: STATISTICS,
              key: apiKey,
              id: videoIdsChunk.join(','),
              maxResults: 50,
            },
            headers: this.getHeader(accessToken),
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                error.response.data || GOOGLE + ERROR_GET_VIDEOS,
              );
              throw new Error(GOOGLE + ERROR_GET_VIDEOS);
            }),
          ),
      );
      const items = response.data.items;
      if (items) {
        items.forEach((item: any) => {
          const videoId = item.id;
          const statistics = item.statistics;
          videoStatistics.push({
            videoId,
            viewCount: statistics.viewCount ? +statistics.viewCount : undefined,
            likeCount: statistics.likeCount ? +statistics.likeCount : undefined,
            dislikeCount: statistics.dislikeCount
              ? +statistics.dislikeCount
              : undefined,
            favoriteCount: statistics.favoriteCount
              ? +statistics.favoriteCount
              : undefined,
            commentCount: statistics.commentCount
              ? +statistics.commentCount
              : undefined,
          });
        });
      }
    }
    return videoStatistics;
  }

  async getUserInfo(accessToken: string) {
    const response = await firstValueFrom(
      this.httpService
        .get<any>(YOUTUBE_OAUTH2_URL + USER_INFO_URL, {
          params: {
            access_token: accessToken,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new Error(ERROR_GET_USER_INFO);
          }),
        ),
    );
    return response.data;
  }
  private getHeader(accessToken: string) {
    return {
      Authorization: BEARER + accessToken,
      Accept: APPLICATION_JSON,
    };
  }
}
