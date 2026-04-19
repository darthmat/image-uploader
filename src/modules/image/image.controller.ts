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
import { EntityNotFoundError, ValidationError } from '@/utils/errors.js';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

@Route('images')
export class ImagesController extends Controller {
  constructor(private readonly imageService: IImageService) {
    super();
  }

  @Get(':id')
  @SuccessResponse('200', 'OK')
  @Response(404, 'Image not found')
  async getImage(@Path() id: string): Promise<ImageDTO | null> {
    const image = await this.imageService.getImage(id);

    if (!image) {
      throw new EntityNotFoundError('Image', id);
    }

    return image;
  }

  @Get()
  @SuccessResponse('200', 'OK')
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
  @SuccessResponse('200', 'OK')
  @Response(400, 'Validation failed')
  async saveImages(
    @UploadedFile() file: Express.Multer.File,
    @Query() width: number,
    @Query() height: number,
    @FormField() title: string,
  ): Promise<void> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new ValidationError('Unsupported image format');
    }

    await this.imageService.saveImage(file, title, { width, height });
  }
}
