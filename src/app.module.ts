import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ConfigurationModule } from './config/config.module';
import { MongoDbModule } from './config/mongo/mongodb.module';
import { UsersModule } from './users/user.module';
import { TwitchModule } from './twitch/twitch.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    ConfigurationModule,
    AuthModule,
    ChannelModule,
    MongoDbModule,
    UsersModule,
    TwitchModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
