import { Controller, Get } from '@nestjs/common';
import { TwitchClient } from './twitch.client';

@Controller('twitch')
export class TwitchController {
  constructor(private twitchClient: TwitchClient) {}
  @Get()
  async twitchAuth(accessToken: string) {
    return this.twitchClient.getUser(accessToken);
  }
}
