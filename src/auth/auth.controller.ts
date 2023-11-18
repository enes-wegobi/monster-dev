import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('twitch')
  @UseGuards(AuthGuard('twitch'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async twitchAuth(@Req() req) {}

  @Get('twitch/callback')
  @UseGuards(AuthGuard('twitch'))
  async twitchAuthRedirect(@Req() req) {
    console.log(req.user);
    return {
      message: 'Authentication successful!',
      user: req.user,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'Google authentication successful',
      user: req.user,
    };
  }
}
