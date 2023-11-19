import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitchClient } from 'src/twitch/twitch.client';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private twitchClient: TwitchClient,
    private configService: ConfigService,
  ) {}
  /*
{
    "data": [
        {
            "id": "991666634",
            "login": "krkmazmrv",
            "display_name": "krkmazmrv",
            "type": "",
            "broadcaster_type": "",
            "description": "",
            "profile_image_url": "https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-a4c9-4724-b1dd-9f00b46cbd3d-profile_image-300x300.png",
            "offline_image_url": "",
            "view_count": 0,
            "email": "krkmaz.mrv@gmail.com",
            "created_at": "2023-11-18T11:18:00Z"
        }
    ]
}*/

  async handleTwitchAuth(request: any) {
    const accessToken = request?.user?.accessToken;
    const refreshToken = request?.user?.refreshToken;

    if (!accessToken) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const data = await this.twitchClient.getUser(accessToken);
    const twitchUser = data[0];

    if (!twitchUser) {
      return this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
    }

    const user = twitchUser.email
      ? await this.userService.findUserWithEmail(twitchUser.email)
      : undefined;

    const redirectUrl = this.configService.get<string>('REDIRECT_URL');

    return user
      ? redirectUrl + user.id
      : this.configService.get<string>('REDIRECT_URL_NOT_FOUND');
  }

  async handleGoogleAuth(request: any) {
    console.log(request);
    if (request?.user?.accessToken) {
      console.log(request?.user?.accessToken);
      return { url: 'http://localhost:3000/form?name=enes' };
    } else {
      return { url: 'http://localhost:3000/404' };
    }
  }
}
