import { Controller, Get } from '@nestjs/common';
import { TwitchClient } from './twitch.client';

@Controller('twitch')
export class TwitchController {
  constructor(private twitchClient: TwitchClient) {}
  @Get(':accessToken')
  async twitchAuth(accessToken: string) {
    return this.twitchClient.getUser(accessToken);
  }

  @Get()
  async twitchGettotalFollowers() {
    return this.twitchClient.getTwitchChannelInfo('zaaxaqsfqzhwtr8vgxg6fhfo0j0mf9', '37402112');
  }
}
