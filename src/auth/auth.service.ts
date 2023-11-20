import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchClient } from 'src/twitch/twitch.client';
import { UserService } from 'src/users/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventType } from 'src/domain/enum/event.enum';
import { TwitchChannelCreateEvent } from 'src/domain/event/twitch-channel-create.event';
import { GoogleClient } from 'src/google/google.client';
import { YoutubeChannelCreateEvent } from 'src/domain/event/youtube-channel-create.event';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private twitchClient: TwitchClient,
    private googleClient: GoogleClient,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async handleTwitchAuth(request: any) {
    const accessToken = request?.user?.accessToken;
    const refreshToken = request?.user?.refreshToken;

    if (!accessToken) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const twitchUser = await this.getTwitchUser(accessToken);

    if (!twitchUser) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }
    const broadcasterId = twitchUser.id;

    if (twitchUser.email) {
      const user = await this.userService.findUserWithEmail(twitchUser.email);
      if (user) {
        if (user.twitchChannel) {
          this.logger.log(
            'User already added twitch channel. User: ' + user.name,
          );
          return;
        }

        await this.updateUserPhoto(user._id, twitchUser.profile_image_url);

        await this.eventEmitter.emitAsync(
          EventType.TWITCH_CHANNEL_CREATE,
          new TwitchChannelCreateEvent({
            channelName: twitchUser.login,
            userId: user._id,
            accessToken,
            refreshToken,
            broadcasterId,
          }),
        );
        const redirectUrl = this.configService.get<string>('REDIRECT_URL');
        return { url: redirectUrl + user._id };
      } else {
        this.logger.error('TWITCH_AUTH_CALLBACK || user mail not matched.');
        return {
          url: this.configService.get<string>('REDIRECT_URL_NOT_FOUND'),
        };
      }
    }
  }

  private async getTwitchUser(accessToken: string) {
    const data = await this.twitchClient.getUser(accessToken);
    return data.data[0];
  }
  private async updateUserPhoto(userId: string, photoUrl: string) {
    await this.userService.updateUser(userId, { photo: photoUrl });
  }

  async handleGoogleAuth(tokens: any) {
    if (tokens.access_token) {
      const accessToken = tokens.access_token;
      const googleUser = await this.googleClient.getUserInfo(accessToken);
      const user = await this.userService.findUserWithEmail(googleUser.email);
      if (user) {
        if (user.youtubeChannel) {
          this.logger.log(
            'User already added youtube channel. User: ' + user.name,
          );
          return;
        }
        await this.updateUserPhoto(user._id, googleUser.picture);

        await this.eventEmitter.emitAsync(
          EventType.YOUTUBE_CHANNEL_CREATE,
          new YoutubeChannelCreateEvent({
            userId: user._id,
            accessToken,
            email: user.email,
          }),
        );
      }
      /*
      {
    "sub": "102600450137362746990",
    "name": "Enes Ozel",
    "given_name": "Enes",
    "family_name": "Ozel",
    "picture": "https://lh3.googleusercontent.com/a/ACg8ocIBv-hlPQ25Rb7PG65IruSJAix7LOti06SILVyMNuYy9kQ=s96-c",
    "email": "enesozel.eo@gmail.com",
    "email_verified": true,
    "locale": "tr"
}
      */

      return { url: 'http://localhost:3000/form?name=enes' };
    } else {
      return { url: 'http://localhost:3000/404' };
    }
  }
}
