import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/domain/schema/user.schema';
import { Model } from 'mongoose';
import { ERROR_USER_NOT_FOUND } from '../domain/model/exception.constant';

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
      throw new BadRequestException(ERROR_USER_NOT_FOUND);
    }
    return user.toObject();
  }
}
