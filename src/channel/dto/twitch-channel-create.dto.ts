export class TwitchChannelCreateDto {
  name: string;
  image: string;
  channelEmail: string;
  accessToken: string;
  refreshToken: string;
  externalId: string;

  constructor(payload: TwitchChannelCreateDto) {
    Object.assign(this, payload);
  }
}
