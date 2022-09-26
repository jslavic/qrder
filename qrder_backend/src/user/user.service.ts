import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user)
      throw new NotFoundException('User with that email does not exist');
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }
}
