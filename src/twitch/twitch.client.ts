import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { BEARER, TWITCH } from 'src/domain/model/contstant';
import { ConfigService } from '@nestjs/config';
import {
  AFTER,
  CHANNEL_URL,
  FIRST,
  TWITCH_BASE_URL,
  USER_URL,
  VIDEO_URL,
} from './twitch-api.constant';
import {
  ERROR_GET_CHANNEL_INFO,
  ERROR_GET_USER_INFO,
  ERROR_GET_VIDEOS,
} from '../domain/model/exception.constant';

@Injectable()
export class TwitchClient {
  private readonly logger = new Logger(TwitchClient.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getUser(accessToken: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(TWITCH_BASE_URL + USER_URL, {
          headers: this.getHeader(accessToken),
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error.response?.data || TWITCH + ERROR_GET_USER_INFO,
            );
            throw new Error(TWITCH + ERROR_GET_USER_INFO);
          }),
        ),
    );
    return data;
  }

  async getChannelTotalFollowers(
    accessToken: string,
    broadcasterId: string,
  ): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(TWITCH_BASE_URL + CHANNEL_URL + broadcasterId, {
          headers: this.getHeader(accessToken),
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error.response?.data || TWITCH + ERROR_GET_CHANNEL_INFO,
            );
            throw new Error(TWITCH + ERROR_GET_CHANNEL_INFO);
          }),
        ),
    );
    return data;
  }

  async getTwitchChannelInfo(accessToken: string, broadcasterId: string) {
    let totalViewCount = 0;
    let totalVideos = 0;
    let cursor = null;

    do {
      const response = await this.getTwitchVideos(
        accessToken,
        broadcasterId,
        cursor,
      );
      const videos = response.data;
      const pagination = response.pagination;

      totalVideos += videos.length;
      videos.forEach((video) => {
        totalViewCount += video.view_count;
      });

      cursor = pagination.cursor;
    } while (cursor);

    return { totalViewCount, totalVideos };
  }

  async getTwitchVideos(
    accessToken: string,
    broadcasterId: string,
    cursor: string | null,
  ) {
    const url =
      TWITCH_BASE_URL +
      VIDEO_URL +
      broadcasterId +
      FIRST +
      (cursor ? AFTER + cursor : '');

    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(url, {
          headers: this.getHeader(accessToken),
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error.response?.data || TWITCH + ERROR_GET_VIDEOS,
            );
            throw new Error(TWITCH + ERROR_GET_VIDEOS);
          }),
        ),
    );
    return data;
  }

  private getHeader(accessToken: string) {
    const clientId = this.configService.get<string>('TWITCH_CLIENT_ID');
    return {
      Authorization: BEARER + accessToken,
      'Client-ID': clientId,
    };
  }
}
