import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrackDto } from './track.dto';
import { v4 as uuid4 } from 'uuid';
import { validate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackEntity } from './track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
  ) {}

  async getAllTracks(): Promise<TrackEntity[]> {
    return await this.trackRepository.find();
  }

  async getTrackById(id: string): Promise<TrackEntity | null> {
    const track = await this.trackRepository.findOne({ where: { id } });
    return track ?? null;
  }

  async createTrack(createTrackDto: TrackDto): Promise<TrackEntity> {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are required');
    }

    const newTrack: TrackEntity = {
      id: uuid4(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration: createTrackDto.duration,
    };

    return await this.trackRepository.save(newTrack);
  }

  async updateTrack(
    id: string,
    createTrackDto: TrackDto,
  ): Promise<TrackEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = await this.trackRepository.findOne({
      where: { id },
    });
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

    return await this.trackRepository.save(track);
  }

  async deleteTrack(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const track = await this.trackRepository.findOne({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.trackRepository.delete(id);
  }

  async removeArtistId(id: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { artistId: id } });
    for (const track of tracks) {
      track.artistId = null;
      await this.trackRepository.save(track);
    }
  }

  async removeAlbumId(id: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { albumId: id } });
    for (const track of tracks) {
      track.albumId = null;
      await this.trackRepository.save(track);
    }
  }
}
