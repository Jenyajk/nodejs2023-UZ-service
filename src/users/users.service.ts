import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto, UpdatePasswordDto } from './create-user.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllUsers(): User[] {
    return this.databaseService.users;
  }

  getUserById(id: string): User {
    const user = this.databaseService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  createUser(createUserDto: CreateUserDto): User {
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
    return newUser;
  }

  updateUser(id: string, updatePasswordDto: UpdatePasswordDto): User {
    const user = this.getUserById(id);

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new BadRequestException('Invalid old password');
    }

    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return user;
  }

  deleteUser(id: string): void {
    const index = this.databaseService.users.findIndex(
      (user) => user.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    this.databaseService.users.splice(index, 1);
  }
}
