export class TwitchChannelCreateDto {
  channelName: string;
  channelImage: string;
  channelEmail: string;
  accessToken: string;
  refreshToken: string;
  broadcasterId: string;

  constructor(payload: TwitchChannelCreateDto) {
    Object.assign(this, payload);
  }
}
