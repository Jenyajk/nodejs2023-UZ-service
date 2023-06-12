import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate } from 'uuid';
import { Album } from '../models/album.model';
import { AlbumDto, UpdateAlbumDto } from './album.dto';
import { DatabaseService } from '../database/database.service';
import { AlbumEntity } from './album.model';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DatabaseService) {}

  getAllAlbums(): Album[] {
    return this.databaseService.albums;
  }

  getAlbumById(id: string): AlbumEntity {
    if (!validate(id)) {
      throw new BadRequestException('Invalid album ID');
    }
    return (
      this.databaseService.albums.find(({ id: albumId }) => albumId === id) ??
      null
    );
  }

  createAlbum(createAlbumDto: AlbumDto): AlbumEntity {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    this.databaseService.albums.push(newAlbum);
    return newAlbum;
  }

  // updateAlbum(id: string, updateAlbumDto: UpdateAlbumDto): AlbumEntity {
  //   validate(id);
  //   const album = this.getAlbumById(id);
  //   album.name = updateAlbumDto.name;
  //   album.year = updateAlbumDto.year;
  //   album.artistId = updateAlbumDto.artistId;
  //   return album;
  // }

  deleteAlbum(id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    const albumIndex = this.databaseService.albums.findIndex(
      (album) => album.id === id,
    );

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.databaseService.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    this.databaseService.albums.splice(albumIndex, 1);
  }
  removeArtistId(id: string) {
    this.databaseService.albums.forEach((album: Album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
