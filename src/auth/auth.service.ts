import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchClient } from 'src/twitch/twitch.client';
import { GoogleClient } from 'src/google/google.client';
import { TwitchChannelCreateService } from '../channel/service/twitch-channel-create.service';
import { TwitchChannelCreateDto } from '../channel/dto/twitch-channel-create.dto';
import { YoutubeChannelCreateService } from '../channel/service/youtube-channel-create.service';
import { YoutubeChannelCreateDto } from '../channel/dto/youtube-channel-create.dto';
import { ChannelService } from '../channel/service/channel.service';
import { ChannelType } from '../domain/enum/channel-type.enum';
import {
  ERROR_ACCESS_TOKEN_NOT_FOUND,
  ERROR_CHANNEL_ALREADY_ADDED,
  ERROR_GOOGLE_AUTH_GENERAL,
  ERROR_TWITCH_AUTH_GENERAL,
  ERROR_TWITCH_USER_NOT_FOUND,
} from '../domain/model/exception.constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private twitchClient: TwitchClient,
    private googleClient: GoogleClient,
    private configService: ConfigService,
    private channelService: ChannelService,
    private twitchChannelCreateService: TwitchChannelCreateService,
    private youtubeChannelCreateService: YoutubeChannelCreateService,
  ) {}

  async handleTwitchAuth(request: any) {
    try {
      const accessToken = request?.user?.accessToken;

      if (!accessToken) {
        return this.handleAuthError(
          ChannelType.TWITCH,
          ERROR_TWITCH_AUTH_GENERAL,
          ERROR_ACCESS_TOKEN_NOT_FOUND,
        );
      }

      const data = await this.twitchClient.getUser(accessToken);
      const twitchUser = data.data[0];

      if (!twitchUser || !twitchUser.email) {
        return this.handleAuthError(
          ChannelType.TWITCH,
          ERROR_TWITCH_AUTH_GENERAL,
          ERROR_TWITCH_USER_NOT_FOUND,
        );
      }

      const {
        id: externalId,
        email: channelEmail,
        profile_image_url: image,
        login: name,
      } = twitchUser;

      const channel = await this.channelService.doesChannelExist(
        channelEmail,
        ChannelType.TWITCH,
      );

      if (channel) {
        if (!channel.isChannelConnectUser) {
          return {
            url: this.generateRedirectUrl(
              channel._id.toString(),
              ChannelType.TWITCH,
            ),
          };
        } else {
          return this.handleAuthError(
            ChannelType.TWITCH,
            ERROR_CHANNEL_ALREADY_ADDED,
            ERROR_CHANNEL_ALREADY_ADDED,
          );
        }
      }

      const twitchChannelCreateDto: TwitchChannelCreateDto = {
        accessToken,
        refreshToken: request?.user?.refreshToken,
        externalId,
        name,
        channelEmail,
        image,
      };

      const createdChannel =
        await this.twitchChannelCreateService.createTwitchChannel(
          twitchChannelCreateDto,
        );

      return {
        url: this.generateRedirectUrl(
          createdChannel._id.toString(),
          ChannelType.TWITCH,
        ),
      };
    } catch (error) {
      return this.handleAuthError(
        ChannelType.TWITCH,
        ERROR_TWITCH_AUTH_GENERAL,
        error.message,
      );
    }
  }

  async handleGoogleAuth(tokens: any) {
    try {
      const accessToken = tokens.access_token;

      if (!accessToken) {
        return this.handleAuthError(
          ChannelType.YOUTUBE,
          ERROR_GOOGLE_AUTH_GENERAL,
          ERROR_ACCESS_TOKEN_NOT_FOUND,
        );
      }

      const googleUser = await this.googleClient.getUserInfo(accessToken);
      const { email: channelEmail, picture: image } = googleUser;

      const channel = await this.channelService.doesChannelExist(
        channelEmail,
        ChannelType.YOUTUBE,
      );

      if (channel) {
        if (!channel.isChannelConnectUser) {
          return {
            url: this.generateRedirectUrl(
              channel._id.toString(),
              ChannelType.YOUTUBE,
            ),
          };
        } else {
          return this.handleAuthError(
            ChannelType.YOUTUBE,
            ERROR_CHANNEL_ALREADY_ADDED,
            ERROR_CHANNEL_ALREADY_ADDED,
          );
        }
      }

      const youtubeChannelCreateDto: YoutubeChannelCreateDto = {
        accessToken,
        channelEmail,
        image,
      };

      const createdChannel =
        await this.youtubeChannelCreateService.createYoutubeChannel(
          youtubeChannelCreateDto,
        );

      return {
        url: this.generateRedirectUrl(
          createdChannel._id.toString(),
          ChannelType.YOUTUBE,
        ),
      };
    } catch (error) {
      return this.handleAuthError(
        ChannelType.YOUTUBE,
        ERROR_GOOGLE_AUTH_GENERAL,
        error.message,
      );
    }
  }

  private handleAuthError(provider: string, error: string, logError?: any) {
    this.logger.error(`${provider} authentication error: ${logError}`);
    return {
      url: this.generateRedirectErrorUrl(error, provider),
    };
  }

  private generateRedirectErrorUrl(error: string, provider: string): string {
    return `${this.configService.get<string>(
      'REDIRECT_URL',
    )}?error=${error}&channelType=${provider}`;
  }

  private generateRedirectUrl(
    channelId: string,
    channelType: ChannelType,
  ): string {
    return `${this.configService.get<string>(
      'REDIRECT_URL',
    )}?channelId=${channelId}&channelType=${channelType}`;
  }
}
