export class Image {
  readonly id: string;
  readonly title: string;
  readonly url: URL;
  readonly height: number;
  readonly width: number;
  readonly type: string;
  readonly size: number;
  readonly createdAt: Date;

  private constructor(readonly data: ImageData) {
    ({
      id: this.id,
      title: this.title,
      url: this.url,
      height: this.height,
      width: this.width,
      type: this.type,
      size: this.size,
      createdAt: this.createdAt,
    } = data);
  }

  static create(data: Omit<ImageData, 'id'>): Image {
    if (data.title.length < 3) throw new Error('Title too short');

    return new Image({
      ...data,
      id: crypto.randomUUID(),
    });
  }

  static fromPersistence(data: ImageData): Image {
    return new Image({
      ...data,
    });
  }
}

export interface ImageData {
  id: string;
  title: string;
  url: URL;
  height: number;
  width: number;
  type: string;
  size: number;
  createdAt: Date;
}
