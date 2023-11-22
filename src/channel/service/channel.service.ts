import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Channel } from '../../domain/schema/channel.schema';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { ChannelType } from '../../domain/enum/channel-type.enum';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { ERROR_CHANNEL_NOT_FOUND } from '../../domain/model/exception.constant';

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
  async update(channelId: string, updateChannelDto: UpdateChannelDto) {
    const existingChannel = await this.channelModel.findById(channelId).exec();

    if (!existingChannel) {
      throw new NotFoundException(ERROR_CHANNEL_NOT_FOUND);
    }

    const { isChannelConnectUser, userId } = updateChannelDto;

    const updateData = {
      $set: {
        isChannelConnectUser,
        userId,
      },
    };

    return await this.channelModel
      .updateOne({ _id: channelId }, updateData)
      .exec();
  }
  async findById(channelId: string) {
    const id = new mongoose.Types.ObjectId(channelId);
    const channel = await this.channelModel.findById(id).exec();
    if (!channel) {
      throw new NotFoundException(ERROR_CHANNEL_NOT_FOUND);
    }
    return channel.toObject();
  }
  async doesChannelExist(channelEmail: string, type: ChannelType) {
    return await this.channelModel.findOne({ channelEmail, type }).exec();
  }
}
