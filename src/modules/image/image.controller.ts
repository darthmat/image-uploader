import {
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Response,
  UploadedFile,
  Query,
  FormField,
} from 'tsoa';
import { ImageDTO } from './image.dto.js';
import { IImageService, PaginatedResult } from './image.interface.js';
import { EntityNotFoundError } from '@/utils/errors.js';
import { IImageValidationService } from '../validation/validation.interface.js';

@Route('images')
export class ImagesController extends Controller {
  constructor(
    private readonly imageService: IImageService,
    private readonly imageValidationService: IImageValidationService,
  ) {
    super();
  }

  @Get(':id')
  @SuccessResponse(200, 'OK')
  @Response(404, 'Image not found')
  async getImage(@Path() id: string): Promise<ImageDTO | null> {
    const image = await this.imageService.getImage(id);

    if (!image) {
      throw new EntityNotFoundError('Image', id);
    }

    return image;
  }

  @Get()
  @SuccessResponse(200, 'OK')
  async getImages(
    @Query() title?: string,
    @Query() offset = 0,
    @Query() limit = 10,
  ): Promise<PaginatedResult<ImageDTO>> {
    return await this.imageService.getImages(
      {
        offset,
        limit,
      },
      title,
    );
  }

  @Post()
  @SuccessResponse(200, 'OK')
  @Response(400, 'Validation failed')
  async saveImages(
    @UploadedFile() file: Express.Multer.File,
    @FormField() width: string,
    @FormField() height: string,
    @FormField() title: string,
  ): Promise<void> {
    const parsedWidth = Number(width);
    const parsedHeight = Number(height);

    this.imageValidationService.validate(
      file,
      parsedWidth,
      parsedHeight,
      title,
    );

    await this.imageService.saveImage(file, title, {
      width: parsedWidth,
      height: parsedHeight,
    });
  }
}
