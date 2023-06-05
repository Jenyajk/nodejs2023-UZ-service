import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  createArtist(@Body() createArtistDto: ArtistDto): Artist {
    try {
      return this.artistsService.createArtist(createArtistDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  updateArtist(
    @Param('id') id: string,
    @Body() createArtistDto: ArtistDto,
  ): Artist {
    try {
      return this.artistsService.updateArtist(id, createArtistDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  deleteArtist(@Param('id') id: string): void {
    try {
      this.artistsService.deleteArtist(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
