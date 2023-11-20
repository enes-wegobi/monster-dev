import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { BEARER } from 'src/domain/model/contstant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitchClient {
  private readonly logger = new Logger(TwitchClient.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getUser(accessToken: string): Promise<any> {
    const authorization = this.populateAccessToken(accessToken);
    const clientId = this.configService.get<string>('TWITCH_CLIENT_ID');
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>('https://api.twitch.tv/helix/users', {
          headers: {
            Authorization: authorization,
            'Client-Id': clientId,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new Error('An error happened!');
          }),
        ),
    );
    return data;
  }

  async getChannelTotalFollowers(
    accessToken: string,
    broadcasterId: string,
  ): Promise<any> {
    const authorization = this.populateAccessToken(accessToken);
    const clientId = this.configService.get<string>('TWITCH_CLIENT_ID');
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(
          `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}`,
          {
            headers: {
              Authorization: authorization,
              'Client-Id': clientId,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            //todo
            /*
            {
              "error": "Unauthorized",
              "status": 401,
              "message": "Invalid OAuth token"
            }
            */
            /*
           {
              "error": "Bad Request",
              "status": 400,
              "message": "Missing required parameter \"broadcaster_id\""
            }
           */
            this.logger.error(error.response.data);
            throw new Error('An error happened!');
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
    const clientId = this.configService.get<string>('TWITCH_CLIENT_ID');
    const authorization = this.populateAccessToken(accessToken);
    const url = `https://api.twitch.tv/helix/videos?user_id=${broadcasterId}&first=100${
      cursor ? `&after=${cursor}` : ''
    }`;
    const headers = {
      'Client-ID': clientId,
      Authorization: authorization,
    };
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>(url, {
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new Error('An error happened!');
          }),
        ),
    );
    return data;
  }

  populateAccessToken(accessToken: string): string {
    return BEARER + accessToken;
  }
}
