import { Controller, Get } from '@nestjs/common';
import { GoogleClient } from './google.client';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleClient: GoogleClient) {}

  @Get()
  async twitchGettotalFollowers() {
    return this.googleClient.getChannelInfo('ya29.a0AfB_byCtAqq3OQuV3f1ftS_xkriV1FIQKWM4wiAf5bEeTd0GgECjgl44JXL42UtT8kYuyuvwR9QaSG2DWeHfBTo41uxbsQ2sr4Zz3UyBLpKW8QUcBEbvEbzaQ0k8tHwROhnLjZIMGIPusSmRY-vkztAAmWzQ402ep3QGaCgYKAVYSARMSFQHGX2MiXMkxxPcpEQT_jhiaxg6MYg0171');
  }
  @Get('enes')
  async asd() {
    return this.googleClient.getVideoIds('UU9fNOuLfNMeYUoYn-DnEipw','ya29.a0AfB_byCtAqq3OQuV3f1ftS_xkriV1FIQKWM4wiAf5bEeTd0GgECjgl44JXL42UtT8kYuyuvwR9QaSG2DWeHfBTo41uxbsQ2sr4Zz3UyBLpKW8QUcBEbvEbzaQ0k8tHwROhnLjZIMGIPusSmRY-vkztAAmWzQ402ep3QGaCgYKAVYSARMSFQHGX2MiXMkxxPcpEQT_jhiaxg6MYg0171');
  }
  @Get('cansu')
  async qwe() {
    const arr =[
      "N0dZaNby7_Y",
      "e9eUaQpNwwM"
  ]
    return this.googleClient.getVideoStatistics(arr,'ya29.a0AfB_byCtAqq3OQuV3f1ftS_xkriV1FIQKWM4wiAf5bEeTd0GgECjgl44JXL42UtT8kYuyuvwR9QaSG2DWeHfBTo41uxbsQ2sr4Zz3UyBLpKW8QUcBEbvEbzaQ0k8tHwROhnLjZIMGIPusSmRY-vkztAAmWzQ402ep3QGaCgYKAVYSARMSFQHGX2MiXMkxxPcpEQT_jhiaxg6MYg0171');
  }
}
