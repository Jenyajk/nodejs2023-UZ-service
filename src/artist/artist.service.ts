import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArtistDto } from './artist.dto';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];
  private albums: Album[] = [];

  getAllArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  createArtist(createArtistDto: ArtistDto): Artist {
    if (!createArtistDto.name || createArtistDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, createArtistDto: ArtistDto): Artist {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    if (!createArtistDto.name || createArtistDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    const updatedArtist: Artist = {
      id: id,
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists[artistIndex] = updatedArtist;
    return updatedArtist;
  }

  deleteArtist(id: string): void {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.artists.splice(artistIndex, 1);
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
