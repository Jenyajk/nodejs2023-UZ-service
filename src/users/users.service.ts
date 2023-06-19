import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { validate } from 'uuid';
import { v4 as uuid4 } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './user.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: string): Promise<UserEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Missing login or password');
    }
    const newUser = await this.userRepository.create();
    newUser.id = uuid4();
    newUser.login = createUserDto.login;
    newUser.password = createUserDto.password;
    newUser.version = 1;
    newUser.createdAt = Number(Date.now());
    newUser.updatedAt = Number(Date.now());

    return await this.userRepository.save(newUser);
  }

  async updateUser(id, data) {
    const user = await this.getUserById(id);
    user.password = data.newPassword;
    user.updatedAt = Number(Date.now());
    user.createdAt = Number(user.createdAt);
    user.version += 1;

    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    return await this.userRepository.delete(id);
  }
}
