import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from '../../schema/channel.schema';
import { CreateChannelDto } from '../dto/create-channel.dto';
@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const createdChannel = new this.channelModel(createChannelDto);
    return createdChannel.save();
  }
}
