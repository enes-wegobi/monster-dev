export class TwitchChannelCreateDto {
  channelName: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  broadcasterId: string;

  constructor(payload: TwitchChannelCreateDto) {
    Object.assign(this, payload);
  }
}
