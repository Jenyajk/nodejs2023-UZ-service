import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
