export class YoutubeChannelCreateDto {
  accessToken: string;
  channelImage: string;
  channelEmail: string;

  constructor(payload: YoutubeChannelCreateDto) {
    Object.assign(this, payload);
  }
}
