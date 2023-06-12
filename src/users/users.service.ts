import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserResponse } from '../models/user.model';
import { validate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './create-user.dto';
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
    const newUser = this.userRepository.create();
    newUser.id = uuidv4();
    newUser.login = createUserDto.login;
    newUser.password = createUserDto.password;
    newUser.version = 1;
    newUser.createdAt = Date.now();
    newUser.updatedAt = Date.now();

    return this.userRepository.save(newUser);
  }

  async updateUser(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword) {
      throw new ForbiddenException('You cannot set the same password');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Invalid old password');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const updatedUser = await this.userRepository.save(user);
    if (!updatedUser) {
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deletionResult = await this.userRepository.delete(user.id);
    if (!deletionResult.affected) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // private mapUserToResponse(user: User): UserResponse {
  //   const { id, login, version, createdAt, updatedAt } = user;
  //   return { id, login, version, createdAt, updatedAt };
  // }
}
