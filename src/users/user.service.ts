import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    const newUser = await createdUser.save();
    return newUser.toObject();
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('user not found!');
    }
    return user.toObject();
  }
}
