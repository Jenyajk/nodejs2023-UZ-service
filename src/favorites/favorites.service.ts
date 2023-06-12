import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';
import { Track } from '../models/track.model';
import { FavoritesResponse } from './favorites.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  addTrackToFavorites(trackId: string): string {
    if (!trackId) {
      throw new BadRequestException('Track ID is required');
    }

    const track = this.databaseService.getTrackById(trackId);

    if (!track) {
      throw new BadRequestException('Track not found');
    }

    this.databaseService.favorites.tracks.push(trackId);
    return 'Track added to favorites';
  }

  removeTrackFromFavorites(trackId: string): string {
    if (!trackId) {
      throw new BadRequestException('Track ID is required');
    }

    const index = this.databaseService.favorites.tracks.findIndex(
      (id) => id === trackId,
    );

    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }

    this.databaseService.favorites.tracks.splice(index, 1);
    return 'Track removed from favorites';
  }

  addAlbumToFavorites(albumId: string): string {
    if (!albumId) {
      throw new BadRequestException('Album ID is required');
    }

    const album = this.databaseService.getAlbumById(albumId);

    if (!album) {
      throw new BadRequestException('Track not found');
    }

    this.databaseService.favorites.albums.push(albumId);
    return 'Album added to favorites';
  }

  removeAlbumFromFavorites(albumId: string): string {
    if (!albumId) {
      throw new BadRequestException('Album ID is required');
    }

    const index = this.databaseService.favorites.albums.findIndex(
      (id) => id === albumId,
    );

    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }

    this.databaseService.favorites.albums.splice(index, 1);
    return 'Album removed from favorites';
  }

  addArtistToFavorites(artistId: string): string {
    if (!artistId) {
      throw new BadRequestException('Artist ID is required');
    }

    const artist = this.databaseService.getArtistById(artistId);

    if (!artist) {
      throw new BadRequestException('Track not found');
    }

    this.databaseService.favorites.artists.push(artistId);
    return 'Artist added to favorites';
  }

  removeArtistFromFavorites(artistId: string): string {
    if (!artistId) {
      throw new BadRequestException('Artist ID is required');
    }

    const index = this.databaseService.favorites.artists.findIndex(
      (id) => id === artistId,
    );

    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }

    this.databaseService.favorites.artists.splice(index, 1);
    return 'Artist removed from favorites';
  }

  getFavoriteArtists(): Artist[] {
    const favoriteArtists: Artist[] = [];
    for (const artistId of this.databaseService.favorites.artists) {
      const artist = this.databaseService.getArtistById(artistId);
      if (artist) {
        favoriteArtists.push(artist);
      }
    }
    return favoriteArtists;
  }

  getFavoriteAlbums(): Album[] {
    const favoriteAlbums: Album[] = [];
    for (const albumId of this.databaseService.favorites.albums) {
      const album = this.databaseService.getAlbumById(albumId);
      if (album) {
        favoriteAlbums.push(album);
      }
    }
    return favoriteAlbums;
  }

  getFavoriteTracks(): Track[] {
    const favoriteTracks: Track[] = [];
    for (const trackId of this.databaseService.favorites.tracks) {
      const track = this.databaseService.getTrackById(trackId);
      if (track) {
        favoriteTracks.push(track);
      }
    }
    return favoriteTracks;
  }

  getAllFavorites(): FavoritesResponse {
    const artists = this.getFavoriteArtists();
    const albums = this.getFavoriteAlbums();
    const tracks = this.getFavoriteTracks();

    return {
      artists,
      albums,
      tracks,
    };
  }
  remove(id: string, entityType: string, flag: boolean) {
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
  // addAlbum(id: string) {
  //   return this.addAlbumMain(id, 'album');
  // }
  //
  // addTrack(id: string) {
  //   return this.addTrackMain(id, 'track');
  // }
  //
  // addArtist(id: string) {
  //   return this.addArtistMain(id, 'artist');
  // }

  removeAlbum(id: string, flag = false) {
    return this.remove(id, 'album', flag);
  }

  removeTrack(id: string, flag = false) {
    return this.remove(id, 'track', flag);
  }

  removeArtist(id: string, flag = false) {
    return this.remove(id, 'artist', flag);
  }
}
