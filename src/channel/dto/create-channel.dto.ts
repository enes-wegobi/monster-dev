import { ChannelType } from 'src/domain/enum/channel-type.enum';

export class CreateChannelDto {
  name: string;
  externalId: string;
  image: string;
  channelEmail: string;
  type: ChannelType;
  statistic: StatisticDto;
  token: TokenDto;
  videos?: string[];
}
export class StatisticDto {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export class TokenDto {
  accessToken: string;
  refreshToken?: string;
}
