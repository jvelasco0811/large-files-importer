import { File } from "../domain/File";
import { FileRepositoryMem } from "../domain/FileRepository";

export class StatusFileImport {

    readonly fileImportId: string;

    constructor(fileImportId: string, private memoryFileRepository: FileRepositoryMem) {
        this.fileImportId = fileImportId;
    }


    async run(): Promise<File | undefined> {
        return await this.memoryFileRepository.getById(this.fileImportId);
    }
    


}