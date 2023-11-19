export class TwitchChannelCreateEvent {
    accessToken: string;
    refreshToken: string;
    broadcasterId: string;

  constructor(payload: TwitchChannelCreateEvent) {
    Object.assign(this, payload);
  }
}
