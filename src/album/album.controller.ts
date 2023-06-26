import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Album } from '../models/album.model';
import { AlbumDto } from './album.dto';
import { AlbumService } from './album.service';
import { validate } from 'uuid';
import { AlbumEntity } from './artist.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllAlbums(): AlbumEntity[] {
    return this.albumsService.getAllAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAlbumById(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ): AlbumEntity {
    const album = this.albumsService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  @Post()
  createAlbum(@Body() createAlbumDto: AlbumDto): Album {
    if (!createAlbumDto.name || createAlbumDto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    try {
      return this.albumsService.createAlbum(createAlbumDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() createAlbumDto: AlbumDto) {
    if (!createAlbumDto.name || String(createAlbumDto.name).trim() === '') {
      throw new BadRequestException('Name is required');
    }

    if (!validate(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    try {
      return this.albumsService.updateAlbum(id, createAlbumDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteAlbum(@Param('id') id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    try {
      this.albumsService.deleteAlbum(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
