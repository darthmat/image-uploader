import { Controller, Get, Path, Post, Route, SuccessResponse } from 'tsoa';
import { ImageDTO } from './image.dto.js';
import { IImageService } from './image.interface.js';

@Route('images')
export class ImagesController extends Controller {
  constructor(private readonly imageService: IImageService) {
    super();
  }

  @Get(':id')
  @SuccessResponse('200', 'OK')
  async getImage(@Path() id: string): Promise<ImageDTO | null> {
    return await this.imageService.getImage(id);
  }

  @Get()
  @SuccessResponse('200', 'OK')
  async getImages(): Promise<ImageDTO[]> {
    return await this.imageService.getImages();
  }

  @Post()
  @SuccessResponse('200', 'OK')
  async saveImages(): Promise<void> {
    await this.imageService.saveImage();
  }
}
