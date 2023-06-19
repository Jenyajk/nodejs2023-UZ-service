import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './favorites.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites(): Promise<FavoritesResponse> {
    return await this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrackToFavorites(@Param('id') trackId: string): Promise<string> {
    try {
      return await this.favoritesService.addTrackToFavorites(trackId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException('Track not found');
      }
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrackFromFavorites(
    @Param('id') trackId: string,
  ): Promise<string> {
    try {
      return await this.favoritesService.removeTrackFromFavorites(trackId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException('Track not found');
      }
    }
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbumToFavorites(@Param('id') albumId: string): Promise<string> {
    try {
      return await this.favoritesService.addAlbumToFavorites(albumId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException('Album not found');
      }
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbumFromFavorites(
    @Param('id') albumId: string,
  ): Promise<string> {
    try {
      return await this.favoritesService.removeAlbumFromFavorites(albumId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException('Album not found');
      }
    }
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtistToFavorites(@Param('id') artistId: string): Promise<string> {
    try {
      return await this.favoritesService.addArtistToFavorites(artistId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException('Artist not found');
      }
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtistFromFavorites(
    @Param('id') artistId: string,
  ): Promise<string> {
    try {
      return await this.favoritesService.removeArtistFromFavorites(artistId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException('Artist not found');
      }
    }
  }
}
