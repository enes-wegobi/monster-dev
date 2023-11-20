import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Channel } from '../../domain/schema/channel.schema';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { ChannelType } from '../../domain/enum/channel-type.enum';
@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto) {
    const createdChannel = new this.channelModel(createChannelDto);
    const channel = await createdChannel.save();
    return channel.toObject();
  }
  async doesChannelExist(channelEmail: string, channelType: ChannelType) {
    const channel = await this.channelModel
      .findOne({ channelEmail, channelType })
      .exec();
    return !!channel;
  }
}
