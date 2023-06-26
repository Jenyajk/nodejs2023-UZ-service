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
import { ArtistService } from './artist.service';
import { validate } from 'uuid';

@Controller('artist')
export class ArtistController {
  constructor(private artistsService: ArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllArtists() {
    return this.artistsService.getAllArtists();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getArtistById(@Param('id') id: string) {
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
  createArtist(@Body() createArtistDto: ArtistDto) {
    try {
      return this.artistsService.createArtist(createArtistDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateArtist(@Param('id') id: string, @Body() updateArtistDto: ArtistDto) {
    const artist = this.artistsService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    validate(id);
    const artist = this.artistsService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    this.artistsService.deleteArtist(id);
  }
}
