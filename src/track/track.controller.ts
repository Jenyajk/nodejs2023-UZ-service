import {
  BadRequestException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  HttpStatus,
  Get,
  HttpCode,
  Post,
  Body,
  Put,
  InternalServerErrorException,
} from '@nestjs/common';
import { TrackDto } from './track.dto';
import { Track } from '../models/track.model';
import { TrackService } from './track.service';
import { validate } from 'uuid';
import { TrackEntity } from './track.model';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks(): Track[] {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrackById(@Param('id') id: string): TrackEntity {
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Post()
  createTrack(@Body() createTrackDto: TrackDto): Track {
    try {
      return this.trackService.createTrack(createTrackDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  updateTrack(
    @Param('id') id: string,
    @Body() createTrackDto: TrackDto,
  ): Track {
    try {
      return this.trackService.updateTrack(id, createTrackDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(
          'An error occurred while updating the track',
        );
      }
    }
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTrack(@Param('id') id: string): void {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const trackExists = this.trackService.getTrackById(id);
    if (!trackExists) {
      throw new NotFoundException('Track not found');
    }

    this.trackService.deleteTrack(id);
  }
}
