import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ArtistDto } from './artist.dto';
import { Artist } from '../models/artist.model';
import { validate } from 'uuid';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAllArtists(): Artist[] {
    return this.databaseService.artists;
  }

  getArtistById(id: string): Artist {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artistId');
    }

    const artist = this.databaseService.getArtistById(id);
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

    this.databaseService.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, updateArtistDto: ArtistDto): void {
    const artist = this.getArtistById(id);

    if (
      !updateArtistDto.name ||
      typeof updateArtistDto.name !== 'string' ||
      updateArtistDto.name.trim() === ''
    ) {
      throw new BadRequestException('Name is required');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
  }

  deleteArtist(id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid userId');
    }
    const artistIndex = this.databaseService.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (artistIndex === -1) {
      throw new NotFoundException('Artist not found');
    }

    this.databaseService.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
    this.databaseService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });

    this.databaseService.artists.splice(artistIndex, 1);
  }
}
