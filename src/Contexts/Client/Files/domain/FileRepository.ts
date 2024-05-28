import { File } from "./File";

export interface FileRepository {
  save(chunk: string, fileId: string): Promise<void>
}