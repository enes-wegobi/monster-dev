import { Strategy } from 'passport-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(configService: ConfigService) {
    super({
      authorizationURL: configService.get<string>('TWITCH_AUTHORISZATION_URL'),
      tokenURL: configService.get<string>('TWITCH_TOKEN_URL'),
      clientID: configService.get<string>('TWITCH_CLIENT_ID'),
      clientSecret: configService.get<string>('TWITCH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('TWITCH_CALLBACK_URL'),
      scope: configService.get<string>('TWITCH_SCOPE'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user?: any, info?: any) => void,
  ) {
    const user = {
      accessToken,
      refreshToken,
      profile,
    };
    done(null, user);
  }
}
