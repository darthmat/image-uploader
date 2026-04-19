import { Image } from './image.model.js';

export function createFakeImage(
  overrides: Partial<{
    id: string;
    title: string;
    url: URL;
    width: number;
    height: number;
    type: string;
    size: number;
    createdAt: Date;
  }> = {},
): Image {
  return Image.fromPersistence({
    id: overrides.id ?? crypto.randomUUID(),
    title: overrides.title ?? 'Fake Image',
    url: overrides.url ?? new URL('https://cdn.example.com/fake.png'),
    width: overrides.width ?? 800,
    height: overrides.height ?? 600,
    type: overrides.type ?? 'image/png',
    size: overrides.size ?? 1024,
    createdAt: overrides.createdAt ?? new Date('2024-01-01T00:00:00Z'),
  });
}
