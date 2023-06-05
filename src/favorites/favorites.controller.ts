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

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(): FavoritesResponse {
    return this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrackToFavorites(@Param('id') trackId: string): string {
    try {
      return this.favoritesService.addTrackToFavorites(trackId);
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
  removeTrackFromFavorites(@Param('id') trackId: string): string {
    try {
      return this.favoritesService.removeTrackFromFavorites(trackId);
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
  addAlbumToFavorites(@Param('id') albumId: string): string {
    try {
      return this.favoritesService.addAlbumToFavorites(albumId);
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
  removeAlbumFromFavorites(@Param('id') albumId: string): string {
    try {
      return this.favoritesService.removeAlbumFromFavorites(albumId);
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
  addArtistToFavorites(@Param('id') artistId: string): string {
    try {
      return this.favoritesService.addArtistToFavorites(artistId);
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
  removeArtistFromFavorites(@Param('id') artistId: string): string {
    try {
      return this.favoritesService.removeArtistFromFavorites(artistId);
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
