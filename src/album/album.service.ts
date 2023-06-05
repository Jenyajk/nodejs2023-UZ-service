import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from '../models/album.model';
import { AlbumDto } from './album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
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

    this.albums.push(newAlbum);
    return newAlbum;
  }

  updateAlbum(id: string, createAlbumDto: AlbumDto): Album {
    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    if (!createAlbumDto.name || createAlbumDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    const updatedAlbum: Album = {
      id: id,
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    this.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  deleteAlbum(id: string): void {
    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException('Album not found');
    }

    this.albums.splice(albumIndex, 1);
  }
}
