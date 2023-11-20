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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleOAuth2Client: GoogleOAuth2Client,
  ) {}

  @Get('twitch')
  @UseGuards(AuthGuard('twitch'))
  async twitchAuth(@Req() req) {}

  @Get('twitch/callback')
  @UseGuards(AuthGuard('twitch'))
  @Redirect('http://localhost:3000/form', 302)
  async twitchAuthRedirect(@Req() req) {
    return this.authService.handleTwitchAuth(req);
  }

  @Get('google')
  @Redirect('', 302)
  async googleAuth2() {
    const url = this.googleOAuth2Client.generateUrl();
    return { url };
  }

  @Get('google/callback')
  @Redirect('http://localhost:3000/form', 302)
  async googleAuthRedirect(@Query() code, @Req() req) {
    const { tokens } = await this.googleOAuth2Client.getToken(code);
    return this.authService.handleGoogleAuth(tokens);
  }
}
