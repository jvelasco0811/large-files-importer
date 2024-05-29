import { File } from "./File";

export interface FileRepository {

  saveFileImportStatus(file: File): Promise<void>
  save(chunk: Buffer | Uint8Array, file: File): Promise<void>
  findFileStatusByID(fileId: string): Promise<String | null>
  cancelFileImport(fileId: string): Promise<void>

}

export interface FileRepositoryMem {
  save(file: File): Promise<void>
  getById(id: string): Promise<File | undefined>
  getAllFiles(): Promise<File[]>
  update(file: File): Promise<void>
  cancel(id: string): Promise<File>
}