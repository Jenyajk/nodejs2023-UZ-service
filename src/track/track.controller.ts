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
  async getAllTracks(): Promise<TrackEntity[]> {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTrackById(@Param('id') id: string): Promise<TrackEntity> {
    try {
      const track = await this.trackService.getTrackById(id);
      if (!track) {
        throw new NotFoundException('Track not found');
      }

      return track;
    } catch (error) {
      throw new NotFoundException('Track not found');
    }
  }

  @Post()
  async createTrack(@Body() createTrackDto: TrackDto): Promise<TrackEntity> {
    try {
      return await this.trackService.createTrack(createTrackDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() createTrackDto: TrackDto,
  ): Promise<TrackEntity> {
    try {
      return await this.trackService.updateTrack(id, createTrackDto);
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
  async deleteTrack(@Param('id') id: string): Promise<void> {
    if (!validate(id)) {
      throw new BadRequestException('Invalid trackId');
    }

    const trackExists = await this.trackService.getTrackById(id);
    if (!trackExists) {
      throw new NotFoundException('Track not found');
    }

    await this.trackService.deleteTrack(id);
  }
}
