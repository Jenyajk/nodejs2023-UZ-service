import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Track } from '../models/track.model';
import { TrackDto } from './track.dto';
import { v4 as uuidv4 } from 'uuid';
import { validate } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { TrackEntity } from './track.model';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}
  getAllTracks(): Track[] {
    return this.databaseService.tracks;
  }

  getTrackById(id: string): Track | undefined {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = this.databaseService.tracks.find(
      ({ id: userId }) => userId === id,
    );
    return track ?? null;
  }

  createTrack(createTrackDto: TrackDto): TrackEntity {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are required');
    }

    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };

    this.databaseService.tracks.push(newTrack);
    return newTrack;
  }
  updateTrack(id: string, createTrackDto: TrackDto): Track {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = this.databaseService.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are required');
    }

    track.name = createTrackDto.name;
    track.artistId = createTrackDto.artistId;
    track.albumId = createTrackDto.albumId;
    track.duration = createTrackDto.duration;

    return track;
  }

  deleteTrack(id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const trackIndex = this.databaseService.tracks.findIndex(
      (t) => t.id === id,
    );
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.databaseService.tracks.splice(trackIndex, 1);
  }
  removeArtistId(id: string) {
    this.databaseService.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }

  removeAlbumId(id: string) {
    this.databaseService.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}
