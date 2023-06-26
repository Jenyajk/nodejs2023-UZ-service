import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from '../track/track.entity';
import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/album.entity';
import { FavouritesEntity } from './favorites.entity';

@Module({
  providers: [FavoritesService],
  controllers: [FavoritesController],
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      TrackEntity,
      ArtistEntity,
      AlbumEntity,
      FavouritesEntity,
    ]),
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
