import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/domain/schema/user.schema';
import { Model } from 'mongoose';
import {
  ERROR_CHANNEL_ALREADY_CONNECTED,
  ERROR_EMAIL_ALREADY_REGISTERED,
  ERROR_USER_NOT_FOUND,
} from '../domain/model/exception.constant';
import { ChannelService } from '../channel/service/channel.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private channelService: ChannelService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfEmailIsRegistered(createUserDto.email);

    const channels = createUserDto.channels;
    await this.checkChannelConnections(channels);

    const createdUser = new this.userModel(createUserDto);
    const newUser = await createdUser.save();

    await this.connectChannelsToUser(channels, newUser._id.toString());

    return newUser.toObject();
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException(ERROR_USER_NOT_FOUND);
    }
    return user.toObject();
  }

  private async checkChannelConnections(channelIds: string[]) {
    for (const channelId of channelIds) {
      const channel = await this.channelService.findById(channelId);
      if (channel.isChannelConnectUser) {
        throw new BadRequestException(ERROR_CHANNEL_ALREADY_CONNECTED);
      }
    }
  }

  private async connectChannelsToUser(channelIds: string[], userId: string) {
    const updateData = {
      userId,
      isChannelConnectUser: true,
    };

    for (const channelId of channelIds) {
      await this.channelService.update(channelId, updateData);
    }
  }

  private async checkIfEmailIsRegistered(email: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException(ERROR_EMAIL_ALREADY_REGISTERED);
    }
  }
}
