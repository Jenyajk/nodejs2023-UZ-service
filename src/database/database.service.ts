import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../users/user.model';
import { TrackEntity } from '../track/track.model';
import { ArtistEntity } from '../artist/artist.model';
import { AlbumEntity } from '../album/album.model';
import { FavouritesEntity } from '../favorites/favorites.model';

@Injectable()
export class DatabaseService {
  public readonly favorites: FavouritesEntity;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TrackEntity)
    readonly trackRepository: Repository<TrackEntity>,
    @InjectRepository(ArtistEntity)
    readonly artistRepository: Repository<ArtistEntity>,
    @InjectRepository(AlbumEntity)
    readonly albumRepository: Repository<AlbumEntity>,
  ) {
    this.favorites = new FavouritesEntity();
  }

  async getTrackById(trackId: string): Promise<TrackEntity> {
    const options: FindOneOptions = { where: { id: trackId } };
    return await this.trackRepository.findOne(options);
  }

  async getAlbumById(albumId: string): Promise<AlbumEntity> {
    const options: FindOneOptions = { where: { id: albumId } };
    return await this.albumRepository.findOne(options);
  }

  async getArtistById(artistId: string): Promise<ArtistEntity> {
    const options: FindOneOptions = { where: { id: artistId } };
    return await this.artistRepository.findOne(options);
  }
}
