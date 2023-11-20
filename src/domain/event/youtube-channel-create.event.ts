export class YoutubeChannelCreateEvent {
    userId: string;
    accessToken: string;
    email: string;

  constructor(payload: YoutubeChannelCreateEvent) {
    Object.assign(this, payload);
  }
}
