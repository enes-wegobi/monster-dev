import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchClient } from 'src/twitch/twitch.client';
import { UserService } from 'src/users/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventType } from 'src/domain/enum/event.enum';
import { GoogleClient } from 'src/google/google.client';
import { YoutubeChannelCreateEvent } from 'src/domain/event/youtube-channel-create.event';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TwitchChannelCreateService } from '../channel/service/twitch-channel-create.service';
import { TwitchChannelCreateDto } from '../channel/dto/twitch-channel-create.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private twitchClient: TwitchClient,
    private googleClient: GoogleClient,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private twitchChannelCreateService: TwitchChannelCreateService,
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

    if (!twitchUser.email) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }
    const createUserDto: CreateUserDto = {
      email: twitchUser.email,
      photo: twitchUser.profile_image_url,
    };
    const user = await this.userService.partialCreate(createUserDto);
    if (user.twitchChannel) {
      this.logger.log('User already added twitch channel. User: ' + user.name);
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const twitchChannelCreateDto: TwitchChannelCreateDto = {
      accessToken,
      refreshToken,
      broadcasterId,
      channelName: twitchUser.login,
      userId: user._id.toString(),
    };
    const channel = await this.twitchChannelCreateService.createTwitchChannel(
      twitchChannelCreateDto,
    );

    if (channel) {
      await this.userService.updateUser(user._id.toString(), {
        twitchChannel: channel._id.toString(),
      });
    }
    const redirectUrl = this.configService.get<string>('REDIRECT_URL');
    return { url: redirectUrl + user._id };
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
      return { url: 'http://localhost:3000/form?name=enes' };
    } else {
      return { url: 'http://localhost:3000/404' };
    }
  }
}
