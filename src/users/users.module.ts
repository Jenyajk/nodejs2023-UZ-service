import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { UserEntity } from './user.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
