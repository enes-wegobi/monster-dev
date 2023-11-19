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
    const { data } = await firstValueFrom(
      this.httpService
        .get<any>('https://api.twitch.tv/helix/users', {
          headers: {
            Authorization: this.populateAccessToken(accessToken),
            'Client-Id': this.configService.get<string>('TWITCH_CLIENT_ID'),
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return data;
  }
  populateAccessToken(accessToken: string): string {
    return BEARER + accessToken;
  }
}
