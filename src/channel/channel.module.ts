import { Module } from '@nestjs/common';
import { ChannelService } from './service/channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from '../schema/channel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
  ],
  controllers: [],
  providers: [ChannelService],
})
export class ChannelModule {}
