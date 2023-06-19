import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.model';
import { TrackEntity } from '../track/track.model';
import { ArtistEntity } from '../artist/artist.model';
import { AlbumEntity } from '../album/album.model';
import { FavouritesEntity } from '../favorites/favorites.model';

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
