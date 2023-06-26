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
import { AlbumDto, UpdateAlbumDto } from './album.dto';
import { AlbumService } from './album.service';
import { validate } from 'uuid';
import { AlbumEntity } from './album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumsService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAlbums(): Promise<AlbumEntity[]> {
    return await this.albumsService.getAllAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAlbumById(
    @Param(
      'id',
      new ValidationPipe({
        transform: true,
        exceptionFactory: () => new BadRequestException('Invalid album ID'),
      }),
    )
    id: string,
  ): Promise<AlbumEntity> {
    try {
      return await this.albumsService.getAlbumById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: AlbumDto): Promise<AlbumEntity> {
    return await this.albumsService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAlbum(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<AlbumEntity> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid Id');
    }

    try {
      return await this.albumsService.updateAlbum(id, updateAlbumDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid albumId');
    }

    try {
      await this.albumsService.deleteAlbum(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
