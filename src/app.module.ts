import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ConfigurationModule } from './config/config.module';
import { MongoDbModule } from './config/mongo/mongodb.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigurationModule, AuthModule, ChannelModule, MongoDbModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
