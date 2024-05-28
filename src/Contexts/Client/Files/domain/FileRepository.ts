import { File } from "./File";

export interface FileRepository {
  save(chunk: string): Promise<string | undefined>
}