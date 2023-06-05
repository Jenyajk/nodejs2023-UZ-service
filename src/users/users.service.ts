import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserResponse } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './create-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllUsers(): UserResponse[] {
    return this.databaseService.users.map((user) =>
      this.mapUserToResponse(user),
    );
  }

  getUserById(id: string): UserResponse {
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

  updateUser(id: string, updatePasswordDto: UpdatePasswordDto): UserResponse {
    const user = this.getUserById(id) as User;

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new BadRequestException('Invalid old password');
    }

    const updatedUser: UserResponse = {
      id: user.id,
      login: user.login,
      version: user.version + 1,
      createdAt: user.createdAt,
      updatedAt: Date.now(),
    };

    return updatedUser;
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
  }

  private mapUserToResponse(user: User): UserResponse {
    const { id, login, version, createdAt, updatedAt } = user;
    return { id, login, version, createdAt, updatedAt };
  }
}
