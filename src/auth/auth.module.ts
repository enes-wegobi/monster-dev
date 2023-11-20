import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TwitchStrategy } from './strategy/twitch.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/user.module';
import { TwitchModule } from 'src/twitch/twitch.module';
import { GoogleModule } from 'src/google/google.module';

@Module({
  imports: [PassportModule, UsersModule, TwitchModule, GoogleModule],
  controllers: [AuthController],
  providers: [TwitchStrategy, AuthService],
})
export class AuthModule {}
