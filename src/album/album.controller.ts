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
  ValidationPipe,
} from '@nestjs/common';
import { Album } from '../models/album.model';
import { AlbumDto, UpdateAlbumDto } from './album.dto';
import { AlbumService } from './album.service';
import { validate } from 'uuid';
import { AlbumEntity } from './album.model';

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
      new ValidationPipe({
        transform: true,
        exceptionFactory: () => new BadRequestException('Invalid album ID'),
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
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: AlbumDto): AlbumEntity {
    return this.albumsService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateAlbumInfo(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid Id');
    }
    const album = this.albumsService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    return album;
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
