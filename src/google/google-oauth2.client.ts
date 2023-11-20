import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleOAuth2Client {
  private readonly logger = new Logger(GoogleOAuth2Client.name);

  private readonly oauth2Client = new google.auth.OAuth2(
    this.configService.get<string>('GOOGLE_CLIENT_ID'),
    this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    this.configService.get<string>('GOOGLE_CALLBACK_URL'),
  );

  constructor(private configService: ConfigService) {}
   generateUrl() {
    const scopes = this.configService.get<string>('GOOGLE_SCOPE').split(',');
    const url = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      //access_type: 'offline',
      // If you only need one scope you can pass it as a string
      scope: scopes,
    });
    return url;
  }
  async getToken(code){
    return await this.oauth2Client.getToken(code);

  }
}
