export interface IStorageService {
  save(filename: string, buffer: Buffer): Promise<string>;
}
