export class YoutubeChannelCreateDto {
  accessToken: string;
  picture: string;
  email: string;

  constructor(payload: YoutubeChannelCreateDto) {
    Object.assign(this, payload);
  }
}
