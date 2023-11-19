import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './strategy/twitch.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/user.module';
import { TwitchModule } from 'src/twitch/twitch.module';

@Module({
  imports: [PassportModule, UsersModule, TwitchModule],
  controllers: [AuthController],
  providers: [TwitchStrategy, GoogleStrategy, AuthService],
})
export class AuthModule {}
