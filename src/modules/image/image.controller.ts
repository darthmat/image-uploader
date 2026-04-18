import {
  Controller,
  Get,
  Path,
  Post,
  Route,
  SuccessResponse,
  Response,
  UploadedFile,
  Middlewares,
  Query,
  FormField,
} from 'tsoa';
import { ImageDTO } from './image.dto.js';
import { IImageService } from './image.interface.js';
import multer, { memoryStorage } from 'multer';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

const uploadMiddleware = multer({
  storage: memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported image format'));
    }
  },
}).single('file');

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
      this.setStatus(404);
      throw new Error('Image not found');
    }

    return image;
  }

  @Get()
  @SuccessResponse('200', 'OK')
  async getImages(): Promise<ImageDTO[]> {
    return await this.imageService.getImages();
  }

  @Post()
  @Middlewares(uploadMiddleware)
  @SuccessResponse('200', 'OK')
  async saveImages(
    @UploadedFile() file: Express.Multer.File,
    @Query() width: number,
    @Query() height: number,
    @FormField() title: string,
  ): Promise<void> {
    await this.imageService.saveImage(file, title, { width, height });
  }
}
