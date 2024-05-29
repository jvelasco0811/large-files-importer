import { File } from "../domain/File";
import { FileRepository, FileRepositoryMem } from "../domain/FileRepository";
import { ErrorHandler } from "../shared/ErrorHandler";

export class FileImport {

    readonly url: string

    constructor(url: string, private fileRepository: FileRepository, private memoryFileRepository: FileRepositoryMem ) {
        this.url = this.validateURL(url)
    }
    
    async run(): Promise<File | undefined> {
      const file = File.create();
  
      let downloadTaskController: AbortController | null = null;
  
      const downloadTask = async (file: File) => {
        downloadTaskController = new AbortController();
        file.cancel = () => {
            if (downloadTaskController) {
                downloadTaskController.abort();
                file.status = 'canceled';
            }
        };

        try {
            const response = await fetch(this.url, { signal: downloadTaskController.signal });

            const totalSize = parseInt(response.headers.get('content-length') || '0', 10);

            for await (const chunk of response.body) {
                file.updateStatus(chunk.length, totalSize);
                const decoder = new TextDecoder();
                const text = decoder.decode(chunk);

                this.memoryFileRepository.update(file);
                this.fileRepository.save(chunk, file);
            }

            file.updateFileStatus('finished');
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Download canceled');
                return file;
            }
            throw error;
        }
    };
  
    const urlExists = await this.checkUrlExists();

    if (!urlExists) {
        throw new ErrorHandler('request_error', 'File not exist',404);
    }

    this.memoryFileRepository.save(file);
    downloadTask(file);

    return file;
  }
  

    private validateURL(url: string): string {
      const urlFormat = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})\/([\w,.-]+\.csv)$/i;
      
      if (!urlFormat.test(url)) {
        throw new ErrorHandler('invalid_url_format','Wrong URL format should be a csv file',400);
      }
    
       return url
    }

    private async checkUrlExists(): Promise<boolean> {
      const response = await fetch(this.url, { method: 'HEAD' });
      return response.ok;
    };


}