import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
  imports: [DatabaseModule],
  exports: [AlbumService],
})
export class AlbumModule {}
