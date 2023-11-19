import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:3000/form', 302)
  async googleAuthRedirect(@Req() req) {
    return this.authService.handleGoogleAuth(req);
  }
}
