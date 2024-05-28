import { File } from "../domain/File";
import { FileRepositoryMem } from "../domain/FileRepository";

export class MemoryFileRepository implements FileRepositoryMem {
     
    // readonly file: File
    static files: Map<string, File> = new Map()

     public async save(file: File): Promise<void> {
        MemoryFileRepository.files.set(file.id, file)
     }

     public async getById(id: string): Promise<File | undefined> {
        return MemoryFileRepository.files.get(id);
    }

    public async getAllFiles(): Promise<File[]> {
        return Array.from(MemoryFileRepository.files.values());
    }

    public async update(file: File): Promise<void> {
        MemoryFileRepository.files.set(file.id, file);
    }

    public async cancel(id: string): Promise<File | undefined> {
        const file: File | undefined = MemoryFileRepository.files.get(id);
        if (file) {
            file.updateFileStatus('canceled')
            file.cancel();
        }

        return file;
    }


}