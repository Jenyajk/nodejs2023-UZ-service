import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';

@Module({
  providers: [TrackService],
  controllers: [TrackController],
  imports: [DatabaseModule, TypeOrmModule.forFeature([TrackEntity])],
  exports: [TrackService],
})
export class TrackModule {}
