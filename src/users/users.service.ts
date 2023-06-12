import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserResponse } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './create-user.dto';
import { DatabaseService } from '../database/database.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllUsers(): UserResponse[] {
    return this.databaseService.users.map((user) =>
      this.mapUserToResponse(user),
    );
  }

  getUserById(id: string): UserResponse {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const user = this.databaseService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapUserToResponse(user);
  }

  createUser(createUserDto: CreateUserDto): UserResponse {
    if (!createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Missing login or password');
    }

    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.databaseService.users.push(newUser);
    return this.mapUserToResponse(newUser);
  }

  @HttpCode(HttpStatus.OK)
  updateUser(id: string, updatePasswordDto: UpdatePasswordDto): UserResponse {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = this.getUserById(id) as User;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword)
      throw new ForbiddenException('You can not write the same password');
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Invalid old password');
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  deleteUser(id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const userIndex = this.databaseService.users.findIndex(
      (user) => user.id === id,
    );

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }

    this.databaseService.users.splice(userIndex, 1);

    throw new HttpException(null, HttpStatus.NO_CONTENT);
  }

  private mapUserToResponse(user: User): UserResponse {
    const { id, login, version, createdAt, updatedAt } = user;
    return { id, login, version, createdAt, updatedAt };
  }
}
