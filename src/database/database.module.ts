import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { TrackEntity } from '../track/track.entity';
import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/album.entity';
import { FavouritesEntity } from '../favorites/favorites.entity';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([
      TrackEntity,
      AlbumEntity,
      ArtistEntity,
      UserEntity,
      FavouritesEntity,
    ]),
  ],
})
export class DatabaseModule {}
