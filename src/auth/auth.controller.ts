import { Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('twitch')
  @UseGuards(AuthGuard('twitch'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async twitchAuth(@Req() req) {}

  @Get('twitch/callback')
  @UseGuards(AuthGuard('twitch'))
  @Redirect('http://localhost:3000/form', 302)
  async twitchAuthRedirect(@Req() req, @Res() res: any) {
    console.log(req.user);
    if(req?.user?.accessToken ){
      return { url: 'http://localhost:3000/form?name=enes' }; 
    }else {
      return { url: 'http://localhost:3000/404' }; 
    }
/*
    return res.redirect('http://localhost:3000/form');
    return {
      message: 'Authentication successful!',
      user: req.user,
    };
*/

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
