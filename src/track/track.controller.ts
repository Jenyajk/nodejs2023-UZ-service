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
import { TrackDto } from './track.dto';
import { Track } from '../models/track.model';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly tracksService: TrackService) {}

  @Get()
  getAllTracks(): Track[] {
    return this.tracksService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string): Track {
    try {
      return this.tracksService.getTrackById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  createTrack(@Body() createTrackDto: TrackDto): Track {
    try {
      return this.tracksService.createTrack(createTrackDto);
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
      return this.tracksService.updateTrack(id, createTrackDto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete(':id')
  deleteTrack(@Param('id') id: string): void {
    try {
      this.tracksService.deleteTrack(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
