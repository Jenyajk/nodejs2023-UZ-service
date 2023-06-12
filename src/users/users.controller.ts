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
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdatePasswordDto } from './create-user.dto';
import { UserEntity } from './user.model';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  updateUserPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id') id: string,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(id, updatePasswordDto);
  }

  @Delete(':id')
  //@HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
