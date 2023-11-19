import { ChannelType } from 'src/domain/enum/channel-type.enum';

export class CreateChannelDto {
  name: string;
  channelId: string;
  tokenInfo: TokenInfoDto;
  channelType: ChannelType;
  statistic: StatisticDto;
}
export class StatisticDto {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export class TokenInfoDto{
  accessToken: string;
  refreshToken: string;
}
