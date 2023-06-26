import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate } from 'uuid';
import { ArtistDto } from './artist.dto';
import { DatabaseService } from '../database/database.service';
import { ArtistEntity } from './artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllArtists(): Promise<ArtistEntity[]> {
    return await this.databaseService.artistRepository.find();
  }

  async getArtistById(id: string): Promise<ArtistEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artistId');
    }

    const artist = await this.databaseService.artistRepository.findOne({
      where: { id },
    });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async createArtist(createArtistDto: ArtistDto): Promise<ArtistEntity> {
    if (!createArtistDto.name || createArtistDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    const newArtist: ArtistEntity = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    return await this.databaseService.artistRepository.save(newArtist);
  }
  async updateArtist(
    id: string,
    updateArtistDto: ArtistDto,
  ): Promise<ArtistEntity> {
    const artist = await this.getArtistById(id);

    if (
      !updateArtistDto.name ||
      typeof updateArtistDto.name !== 'string' ||
      updateArtistDto.name.trim() === ''
    ) {
      throw new BadRequestException('Name is required');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return await this.databaseService.artistRepository.save(artist);
  }

  async deleteArtist(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artistId');
    }
    const artist = await this.getArtistById(id);

    await this.databaseService.albumRepository.update(
      { artistId: id },
      { artistId: null },
    );
    await this.databaseService.trackRepository.update(
      { artistId: id },
      { artistId: null },
    );

    await this.databaseService.artistRepository.delete(artist);
  }
}
