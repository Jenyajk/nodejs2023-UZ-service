import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdatePasswordDto } from './create-user.dto';
import { UserEntity } from './user.entity';
import { validate } from 'uuid';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  getAllUsers(): UserEntity[] {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): UserEntity {
    const user = this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto || !createUserDto.login || !createUserDto.password) {
      throw new BadRequestException('Login and password are required');
    }
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    if (
      !updatePasswordDto ||
      !updatePasswordDto.oldPassword ||
      !updatePasswordDto.newPassword
    ) {
      throw new BadRequestException('Password and old password are required');
    }
    return this.usersService.updateUser(id, updatePasswordDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    validate(id);
    const user = this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.usersService.deleteUser(id);
  }
}
