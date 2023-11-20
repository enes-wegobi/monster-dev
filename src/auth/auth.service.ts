import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchClient } from 'src/twitch/twitch.client';
import { GoogleClient } from 'src/google/google.client';
import { TwitchChannelCreateService } from '../channel/service/twitch-channel-create.service';
import { TwitchChannelCreateDto } from '../channel/dto/twitch-channel-create.dto';
import { YoutubeChannelCreateService } from '../channel/service/youtube-channel-create.service';
import { YoutubeChannelCreateDto } from '../channel/dto/youtube-channel-create.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private twitchClient: TwitchClient,
    private googleClient: GoogleClient,
    private configService: ConfigService,
    private twitchChannelCreateService: TwitchChannelCreateService,
    private youtubeChannelCreateService: YoutubeChannelCreateService,
  ) {}

  async handleTwitchAuth(request: any) {
    const accessToken = request?.user?.accessToken;

    if (!accessToken) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const twitchUser = await this.getTwitchUser(accessToken);

    if (!twitchUser || !twitchUser.email) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const {
      id: broadcasterId,
      email: channelEmail,
      profile_image_url: channelImage,
      login: channelName,
    } = twitchUser;

    //todo check channel already added with email
    const channel = {};
    if (channel) {
      this.logger.log('User already added youtube channel.');
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const twitchChannelCreateDto: TwitchChannelCreateDto = {
      accessToken,
      refreshToken: request?.user?.refreshToken,
      broadcasterId,
      channelName,
      channelEmail,
      channelImage,
    };

    const createdChannel =
      await this.twitchChannelCreateService.createTwitchChannel(
        twitchChannelCreateDto,
      );

    const redirectUrl = this.configService.get<string>('REDIRECT_URL');
    return { url: redirectUrl + createdChannel._id };
  }

  private async getTwitchUser(accessToken: string) {
    const data = await this.twitchClient.getUser(accessToken);
    return data.data[0];
  }

  async handleGoogleAuth(tokens: any) {
    const accessToken = tokens.access_token;
    if (accessToken) {
      const googleUser = await this.googleClient.getUserInfo(accessToken);
      const { email, picture } = googleUser;

      //todo check channel already added with email
      const channel = {};
      if (channel) {
        this.logger.log('User already added youtube channel.');
        return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
      }

      const youtubeChannelCreateDto: YoutubeChannelCreateDto = {
        accessToken,
        email,
        picture,
      };

      const createdChannel =
        await this.youtubeChannelCreateService.createYoutubeChannel(
          youtubeChannelCreateDto,
        );

      const redirectUrl = this.configService.get<string>('REDIRECT_URL');
      return { url: redirectUrl + createdChannel._id };
    } else {
      return { url: this.configService.get<string>('REDIRECT_URL_NOT_FOUND') };
    }
  }
}
