import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DatabaseModule } from '../database/database.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from './artist.model';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [
    DatabaseModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forFeature([ArtistEntity]),
  ],
  exports: [ArtistService],
})
export class ArtistModule {}
