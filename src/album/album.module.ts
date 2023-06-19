import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [DatabaseModule, TypeOrmModule.forFeature([AlbumEntity])],
  exports: [AlbumService],
})
export class AlbumModule {}
