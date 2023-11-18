import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './strategy/twitch.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [TwitchStrategy, GoogleStrategy],
})
export class AuthModule {}
