import { Module } from '@nestjs/common';
import { TwitchClient } from './twitch.client';
import { HttpModule } from '@nestjs/axios';
import { TwitchController } from './twitch.controller';
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [TwitchController],
  providers: [TwitchClient],
  exports: [TwitchClient],
})
export class TwitchModule {}
