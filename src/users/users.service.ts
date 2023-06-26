import {
  BadRequestException,
  ForbiddenException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { DatabaseService } from '../database/database.service';
import { HttpStatus } from '@nestjs/common';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllUsers(): UserEntity[] {
    return this.databaseService.users;
  }
  getUserByLogin(id: string): UserEntity | undefined {
    return this.databaseService.users.find((user: User) => user.id === id);
  }

  getUserById(id: string): UserEntity | undefined {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const user = this.databaseService.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser({ login, password }: CreateUserDto) {
    const hash = await this.hashPassword(password);
    if (!hash) throw new Error();

    const newUser = new UserEntity({
      id: uuidv4(),
      login: login,
      password: hash,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.databaseService.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, { oldPassword, newPassword }) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const match = await compare(oldPassword, user.password);
    if (!match) throw new ForbiddenException('Old password is wrong');
    if (oldPassword === newPassword)
      throw new ForbiddenException('You can not write the same password');

    user.password = await this.hashPassword(newPassword);
    user.version += 1;
    user.updatedAt = Date.now();
    return user;
  }
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validateUser({ login, password }: CreateUserDto) {
    const user = await this.databaseService.users.find(
      (user: User) => user.login === login,
    );
    if (!user)
      throw new ForbiddenException({
        message: `User with login: ${login} is not exist`,
      });
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      throw new ForbiddenException({
        message: `User password: ${password} is incorrect`,
      });
    return user;
  }

  deleteUser(id: string): void {
    const userIndex = this.databaseService.users.findIndex(
      (user) => user.id === id,
    );

    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    this.databaseService.users.splice(userIndex, 1);
  }
}
