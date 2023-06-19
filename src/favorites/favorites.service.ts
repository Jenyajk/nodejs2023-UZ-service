import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesResponse } from './favorites.dto';
import { DatabaseService } from '../database/database.service';
import { TrackEntity } from '../track/track.model';
import { AlbumEntity } from '../album/album.model';
import { ArtistEntity } from '../artist/artist.model';
import { Like } from 'typeorm';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async addTrackToFavorites(trackId: string): Promise<string> {
    if (!trackId) {
      throw new BadRequestException('Track ID is required');
    }

    const track = await this.databaseService.trackRepository.findOne({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    this.databaseService.favorites.tracks.push(track);
    return 'Track added to favorites';
  }

  removeTrackFromFavorites(trackId: string): string {
    if (!trackId) {
      throw new BadRequestException('Track ID is required');
    }

    const index = this.databaseService.favorites.tracks.findIndex(
      (track) => track.id === trackId,
    );

    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }

    this.databaseService.favorites.tracks.splice(index, 1);
    return 'Track removed from favorites';
  }

  async addAlbumToFavorites(albumId: string): Promise<string> {
    if (!albumId) {
      throw new BadRequestException('Album ID is required');
    }

    const album = await this.databaseService.albumRepository.findOne({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    this.databaseService.favorites.albums.push(album);
    return 'Album added to favorites';
  }

  removeAlbumFromFavorites(albumId: string): string {
    if (!albumId) {
      throw new BadRequestException('Album ID is required');
    }

    const index = this.databaseService.favorites.albums.findIndex(
      (album) => album.id === albumId,
    );

    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }

    this.databaseService.favorites.albums.splice(index, 1);
    return 'Album removed from favorites';
  }

  async addArtistToFavorites(artistId: string): Promise<string> {
    if (!artistId) {
      throw new BadRequestException('Artist ID is required');
    }

    const artist = await this.databaseService.artistRepository.findOne({
      where: { id: artistId },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    this.databaseService.favorites.artists.push(artist);
    return 'Artist added to favorites';
  }

  removeArtistFromFavorites(artistId: string): string {
    if (!artistId) {
      throw new BadRequestException('Artist ID is required');
    }

    const index = this.databaseService.favorites.artists.findIndex(
      (artist) => artist.id === artistId,
    );

    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }

    this.databaseService.favorites.artists.splice(index, 1);
    return 'Artist removed from favorites';
  }

  async getFavoriteArtists(): Promise<ArtistEntity[]> {
    const favoriteArtists: ArtistEntity[] = [];
    for (const artistId of this.databaseService.favorites.artists) {
      const artist = await this.databaseService.artistRepository.findOne({
        where: { id: Like(String(artistId)) },
      });
      if (artist) {
        favoriteArtists.push(artist);
      }
    }
    return favoriteArtists;
  }

  async getFavoriteAlbums(): Promise<AlbumEntity[]> {
    const favoriteAlbums: AlbumEntity[] = [];
    for (const albumId of this.databaseService.favorites.albums) {
      const album = await this.databaseService.albumRepository.findOne({
        where: { id: Like(String(albumId)) },
      });
      if (album) {
        favoriteAlbums.push(album);
      }
    }
    return favoriteAlbums;
  }

  async getFavoriteTracks(): Promise<TrackEntity[]> {
    const favoriteTracks: TrackEntity[] = [];
    for (const trackId of this.databaseService.favorites.tracks) {
      const track = await this.databaseService.trackRepository.findOne({
        where: { id: Like(String(trackId)) },
      });
      if (track) {
        favoriteTracks.push(track);
      }
    }
    return favoriteTracks;
  }

  async getAllFavorites(): Promise<FavoritesResponse> {
    const artists = await this.getFavoriteArtists();
    const albums = await this.getFavoriteAlbums();
    const tracks = await this.getFavoriteTracks();

    return {
      artists,
      albums,
      tracks,
    };
  }

  private remove(id: string, entityType: string, flag: boolean) {
    const entityIdx = this.databaseService.favorites[
      `${entityType}s`
    ].findIndex((entityId) => entityId === id);
    if (entityIdx === -1) {
      if (!flag) {
        throw new HttpException(
          `${entityType.toUpperCase()} with id:${id} is not favorite`,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      this.databaseService.favorites[`${entityType}s`].splice(entityIdx, 1);
    }
    return { message: `${entityType.toUpperCase()} successfully deleted` };
  }

  async removeAlbum(id: string, flag = false) {
    return this.remove(id, 'album', flag);
  }

  async removeTrack(id: string, flag = false) {
    return this.remove(id, 'track', flag);
  }

  async removeArtist(id: string, flag = false) {
    return this.remove(id, 'artist', flag);
  }
}
