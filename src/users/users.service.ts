import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findUserWithEmail(createUserDto.email);
    if (existingUser) {
      if (!existingUser.canJoin) {
        throw new BadRequestException('This mail already in use.');
      }
      return;
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findUserWithEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if(!user){
      throw new BadRequestException('user not found!');
    }
    return user;
  }
}
