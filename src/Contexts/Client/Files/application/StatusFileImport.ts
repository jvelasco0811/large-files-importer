import { File } from "../domain/File";
import { FileRepositoryMem } from "../domain/FileRepository";
import { CustomError } from "../shared/CustomError";


export class StatusFileImport {

    readonly fileImportId: string;

    constructor(fileImportId: string, private memoryFileRepository: FileRepositoryMem) {
        this.fileImportId = this.validateToken(fileImportId)
    }


    async run(): Promise<File | undefined> {
        return await this.memoryFileRepository.getById(this.fileImportId);
    }
    
    private validateToken(fileImportId: string): string {
        const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

        if (!uuidv4Regex.test(fileImportId)) {
          throw new CustomError('invalid_token','Invalid file id');
        }
      
         return fileImportId
      }

}