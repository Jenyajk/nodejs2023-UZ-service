import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistDto } from './artist.dto';
import { Artist } from '../models/artist.model';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistsService: ArtistService) {}

  @Get()
  getAllArtists(): Artist[] {
    return this.artistsService.getAllArtists();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string): Artist {
    try {
      return this.artistsService.getArtistById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while retrieving the artist',
        );
      }
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Body() createArtistDto: ArtistDto): Artist {
    try {
      return this.artistsService.createArtist(createArtistDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: ArtistDto,
  ): void {
    try {
      this.artistsService.updateArtist(id, updateArtistDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string): void {
    const artist = this.artistsService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    this.artistsService.deleteArtist(id);
  }
}
