import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate } from 'uuid';
import { AlbumDto, UpdateAlbumDto } from './album.dto';
import { DatabaseService } from '../database/database.service';
import { AlbumEntity } from './album.model';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DatabaseService) {}

  async getAllAlbums(): Promise<AlbumEntity[]> {
    return await this.databaseService.albumRepository.find();
  }

  async getAlbumById(id: string): Promise<AlbumEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid album ID');
    }

    const album = await this.databaseService.albumRepository.findOne({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async createAlbum(createAlbumDto: AlbumDto): Promise<AlbumEntity> {
    const newAlbum: AlbumEntity = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };

    return await this.databaseService.albumRepository.save(newAlbum);
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    const album = await this.getAlbumById(id);

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    return await this.databaseService.albumRepository.save(album);
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    const album = await this.getAlbumById(id);

    await this.databaseService.trackRepository.update(
      { albumId: id },
      { albumId: null },
    );

    await this.databaseService.albumRepository.delete(id);
  }

  async removeArtistId(id: string): Promise<void> {
    await this.databaseService.albumRepository.update(
      { artistId: id },
      { artistId: null },
    );
  }
}
