import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async partialCreate(createUserDto: CreateUserDto) {
    const existingUser = await this.findUserWithEmail(createUserDto.email);
    if (existingUser) {
      return existingUser;
    }
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();
    return user.toObject();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findUserWithEmail(createUserDto.email);
    if (existingUser) {
      if (!existingUser.canJoin) {
        throw new BadRequestException('This mail already in use.');
      }
      return;
    }
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();
    return user.toObject();
  }

  async findUserWithEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });
    return user ? user.toObject() : undefined;
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('user not found!');
    }
    return user.toObject();
  }

  async updateUser(
    userId: string,
    updatedFields: Partial<User>,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });
    return user.toObject();
  }
}
