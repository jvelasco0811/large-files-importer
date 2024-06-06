
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { File } from "../domain/File";
import { FileRepository, FileRepositoryMem } from "../domain/FileRepository";
import { ErrorHandler } from "../shared/ErrorHandler";


export class FileImport {
    readonly url: string;

    constructor(url: string, private fileRepository: FileRepository, private memoryFileRepository: FileRepositoryMem) {
        this.url = this.validateURL(url);
    }

    async run(): Promise<File> {

        const urlExists = await this.checkUrlExists();

        if (!urlExists) {
            throw new ErrorHandler('request_error', 'File not exist',404);
        }

        const file = File.create();
        await this.memoryFileRepository.save(file);
    
        this.downloadTask(file);
    
        this.downloadTask(file).catch(error => {
            console.error('Download task failed:', error);
        });

        return file;
    }

    private async downloadTask(file: File): Promise<void> {
        const downloadTaskController = new AbortController();

        file.cancel = () => {
            if (downloadTaskController) {
                downloadTaskController.abort();
                file.status = 'canceled';
            }
        };
    
        try {
            const response = await fetch(this.url, { signal: downloadTaskController.signal });
        
            const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
      
            const stream = Readable.from(response.body)
    
            const options = { signal: downloadTaskController.signal, highWaterMark: 1024 * 1024 };

            await pipeline(
                stream,
                async function* (source: any) {

                    for await (const chunk of source) {
                        if (downloadTaskController.signal.aborted) {
                            break;
                        }
                        await file.updateStatus(chunk.length, totalSize);

                        yield chunk;

                    }
                }.bind(this),
                async (source) => {
                    for await (const chunk of source) {
                        if (downloadTaskController.signal.aborted) {
                            break;
                        }
                        await this.fileRepository.save(chunk, file);

                    }
                },
                options
            );
    
            if (!downloadTaskController.signal.aborted) {
                file.updateFileStatus('finished');
                await this.memoryFileRepository.update(file);
            }
    
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log({ type: 'abort_error', message: 'Download canceled' });
            } else {
                console.error('Download failed:', error);
                throw new ErrorHandler('download_error', `Download failed: ${error.message}`, 500);
            }
        }
    }
    

    private validateURL(url: string): string {
        const urlFormat = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})\/([\w,.-]+\.csv)$/i;
      
        if (!urlFormat.test(url)) {
          throw new ErrorHandler('invalid_url_format','Wrong URL format should be a csv file',400);
        }
      
         return url
    }

    private async checkUrlExists(): Promise<boolean> {
        try {
            const response = await fetch(this.url, { method: 'HEAD' });
            return response.ok;
        } catch (error: any) {
            throw new ErrorHandler('request_error', `Failed to check URL: ${error.message}`, 500);
        }
    }
}
