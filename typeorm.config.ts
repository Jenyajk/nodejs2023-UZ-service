import { DataSource } from 'typeorm';
import { ArtistEntity } from './src/artist/artist.entity';
import { AlbumEntity } from './src/album/album.entity';
import { FavouritesEntity } from './src/favorites/favorites.entity';
import * as dotenv from 'dotenv';
import { UserEntity } from './src/users/user.entity';
import { TrackEntity } from './src/track/track.entity';
dotenv.config();

export default new DataSource({
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
});
