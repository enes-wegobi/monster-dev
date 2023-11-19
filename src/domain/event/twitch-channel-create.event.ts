export class TwitchChannelCreateEvent {
    channelName: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    broadcasterId: string;

  constructor(payload: TwitchChannelCreateEvent) {
    Object.assign(this, payload);
  }
}
