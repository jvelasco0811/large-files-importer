import { File } from "./File";

export interface FileRepository {

  save(chunk: Buffer | Uint8Array, file: File): Promise<void>
  cancelFileImport(fileId: string): Promise<void>

}

export interface FileRepositoryMem {
  save(file: File): Promise<void>
  getById(id: string): Promise<File | undefined>
  getAllFiles(): Promise<File[]>
  update(file: File): Promise<void>
  cancel(id: string): Promise<File>
}