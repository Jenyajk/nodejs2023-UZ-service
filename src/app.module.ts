import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.model';
import { AlbumEntity } from './album/album.model';
import { TrackEntity } from './track/track.model';
import { ArtistEntity } from './artist/artist.model';
import { FavouritesEntity } from './favorites/favorites.model';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavoritesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      entities: [
        UserEntity,
        ArtistEntity,
        AlbumEntity,
        TrackEntity,
        FavouritesEntity,
      ],
      synchronize: true,
      migrations: [__dirname + '/migrations/*.ts'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
