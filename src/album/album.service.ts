import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate } from 'uuid';
import { Album } from '../models/album.model';
import { AlbumDto } from './album.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DatabaseService) {}

  getAllAlbums(): Album[] {
    return this.databaseService.albums;
  }

  getAlbumById(id: string): Album {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const album = this.databaseService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  createAlbum(createAlbumDto: AlbumDto): Album {
    if (!createAlbumDto.name || createAlbumDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    this.databaseService.albums.push(newAlbum);
    return newAlbum;
  }

  updateAlbum(id: string, createAlbumDto: AlbumDto): Album {
    const album = this.getAlbumById(id);

    if (!createAlbumDto.name || createAlbumDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = createAlbumDto.artistId;

    return album;
  }

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
}
