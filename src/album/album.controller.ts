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
  Post,
  Put,
} from '@nestjs/common';
import { Album } from '../models/album.model';
import { AlbumDto } from './album.dto';
import { AlbumService } from './album.service';
import { validate } from 'uuid';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  getAllAlbums(): Album[] {
    return this.albumsService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string): Album {
    try {
      return this.albumsService.getAlbumById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
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
  updateAlbum(
    @Param('id') id: string,
    @Body() createAlbumDto: AlbumDto,
  ): Album {
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
