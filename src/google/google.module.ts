import { Module } from '@nestjs/common';
import { GoogleClient } from './google.client';
import { HttpModule } from '@nestjs/axios';
import { GoogleOAuth2Client } from './google-oauth2.client';
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [GoogleClient, GoogleOAuth2Client],
  exports: [GoogleClient, GoogleOAuth2Client],
})
export class GoogleModule {}
