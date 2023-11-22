import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from '../domain/schema/video.schema';

@Injectable()
export class VideoService {
  constructor(@InjectModel(Video.name) private videoModel: Model<Video>) {}
  async createAll(createVideoDtos: CreateVideoDto[]): Promise<string[]> {
    const videosToCreate = createVideoDtos.map(
      (createVideoDto) => new this.videoModel(createVideoDto),
    );
    const createdVideos = await this.videoModel.insertMany(videosToCreate);
    return createdVideos.map((video) => video._id.toString());
  }
}
