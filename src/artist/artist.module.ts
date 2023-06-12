import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DatabaseModule } from '../database/database.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  imports: [
    DatabaseModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  exports: [ArtistService],
})
export class ArtistModule {}
