import { ChannelType } from 'src/domain/enum/channel-type.enum';

export class CreateChannelDto {
  name: string;
  channelId: string;
  tokenInfo: TokenInfoDto;
  channelType: ChannelType;
  statistic: StatisticDto;
  videos?: VideoStatisticDto[];
}
export class VideoStatisticDto {
  channelId: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  favoriteCount: number;
  commentCount: number;
}
export class StatisticDto {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export class TokenInfoDto {
  accessToken: string;
  refreshToken?: string;
}
