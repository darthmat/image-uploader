export class Image {
  public readonly id: string;
  public readonly title: string;
  public readonly url: URL;
  public readonly height: number;
  public readonly width: number;
  public readonly type: string;
  public readonly size: number;
  public readonly createdAt: Date;

  constructor(data: ImageData) {
    this.id = data.id;
    this.title = data.title;
    this.url = data.url;
    this.height = data.height;
    this.width = data.width;
    this.type = data.type;
    this.size = data.size;
    this.createdAt = data.createdAt;
  }
}

interface ImageData {
  id: string;
  title: string;
  url: URL;
  height: number;
  width: number;
  type: string;
  size: number;
  createdAt: Date;
}
