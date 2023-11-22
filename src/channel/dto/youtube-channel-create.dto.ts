export class YoutubeChannelCreateDto {
  accessToken: string;
  image: string;
  channelEmail: string;

  constructor(payload: YoutubeChannelCreateDto) {
    Object.assign(this, payload);
  }
}
