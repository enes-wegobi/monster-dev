import {
  Controller,
  Get,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GoogleOAuth2Client } from 'src/google/google-oauth2.client';
import {
  AUTH,
  GOOGLE_AUTH_CALLBACK_URL,
  GOOGLE_AUTH_URL,
  TWITCH_AUTH_CALLBACK_URL,
  TWITCH_AUTH_URL,
} from '../domain/model/contstant';

@Controller(AUTH)
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleOAuth2Client: GoogleOAuth2Client,
  ) {}

  @Get(TWITCH_AUTH_URL)
  @UseGuards(AuthGuard('twitch'))
  async twitchAuth(@Req() req: any) {}

  @Get(TWITCH_AUTH_CALLBACK_URL)
  @UseGuards(AuthGuard('twitch'))
  @Redirect('', 302)
  async twitchAuthRedirect(@Req() req: any) {
    return this.authService.handleTwitchAuth(req);
  }

  @Get(GOOGLE_AUTH_URL)
  @Redirect('', 302)
  async googleAuth2() {
    const url = this.googleOAuth2Client.generateUrl();
    return { url };
  }

  @Get(GOOGLE_AUTH_CALLBACK_URL)
  @Redirect('', 302)
  async googleAuthRedirect(@Query() code: any) {
    const { tokens } = await this.googleOAuth2Client.getToken(code);
    return await this.authService.handleGoogleAuth(tokens);
  }
}
