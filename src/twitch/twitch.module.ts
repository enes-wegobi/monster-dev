import { Module } from '@nestjs/common';
import { TwitchClient } from './twitch.client';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [TwitchClient],
  exports: [TwitchClient],
})
export class TwitchModule {}
