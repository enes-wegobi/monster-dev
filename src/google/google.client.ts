import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

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
        .get<any>('https://youtube.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'snippet,statistics,contentDetails',
            key: apiKey,
            mine: true,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    const channelInfo = data.items[0];
    if (!channelInfo) {
      throw 'Channel not found!';
    }

    const { viewCount, subscriberCount, videoCount } = channelInfo.statistics;

    const image = channelInfo.snippet.thumbnails.default.url;
    const { title } = channelInfo.snippet;

    const playlistId = channelInfo.contentDetails.relatedPlaylists.uploads;

    return {
      title,
      playlistId,
      image,
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
          .get<any>('https://youtube.googleapis.com/youtube/v3/playlistItems', {
            params: {
              part: 'contentDetails',
              key: apiKey,
              playlistId: playlistId,
              maxResults: 50,
              pageToken: nextPageToken,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
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
  async getVideoStatistics(videoIds: string[], accessToken: string) {
    const chunkSize = 50;
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    const videoStatistics: any[] = [];
    for (let i = 0; i < videoIds.length; i += chunkSize) {
      const videoIdsChunk = videoIds.slice(i, i + chunkSize);
      const response = await firstValueFrom(
        this.httpService
          .get<any>('https://youtube.googleapis.com/youtube/v3/videos', {
            params: {
              part: 'statistics',
              key: apiKey,
              id: videoIdsChunk.join(','),
              maxResults: 50,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
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
            viewCount: +statistics.viewCount,
            likeCount: +statistics.likeCount,
            dislikeCount: +statistics.dislikeCount,
            favoriteCount: +statistics.favoriteCount,
            commentCount: +statistics.commentCount,
          });
        });
      }
    }
    return videoStatistics;
  }

  async getUserInfo(accessToken) {
    const response = await firstValueFrom(
      this.httpService
        .get<any>('https://www.googleapis.com/oauth2/v3/userinfo', {
          params: {
            access_token: accessToken,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    if (response.status === 200) {
      return response.data;
    }
  }
}
