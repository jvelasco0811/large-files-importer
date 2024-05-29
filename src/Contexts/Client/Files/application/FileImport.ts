import { File } from "../domain/File";
import { FileRepository, FileRepositoryMem } from "../domain/FileRepository";
import { CustomError } from "../shared/CustomError";

export class FileImport {

    readonly url: string

    constructor(url: string, private fileRepository: FileRepository, private memoryFileRepository: FileRepositoryMem ) {
        this.url = this.validateURL(url)
    }
    
    async run(): Promise<File | undefined> {

        const file = File.create()

        let downloadTaskController: AbortController | null = null;
        

        const downloadTask = async (file: File) => {
            downloadTaskController = new AbortController();
            file.cancel = () => {
                		if (downloadTaskController) {
                		  downloadTaskController.abort();
                		  file.status = 'canceled';
                		}
            }
            try {
              
                this.memoryFileRepository.save(file)

                const response = await fetch(this.url, { signal: downloadTaskController.signal })

                if (!response.ok) {
                  throw new CustomError('request_error','File not exist')
                }
       
                const totalSize = parseInt(response.headers.get('content-length') || '0', 10);


                for await (const chunk of response.body) {
                    // if (signal.aborted) throw signal.reason;
                    // Do something with the chunk
                    file.updateStatus(chunk.length, totalSize)
                    const decoder = new TextDecoder();
                    let text = decoder.decode(chunk);
                    
                    this.memoryFileRepository.update(file)
                    
                    this.fileRepository.save(chunk, file)

                }

                file.updateFileStatus('finished')

  
            }
            catch (error: any) {
                if(error.name === 'AbortError') {
                  console.log('Download canceled')
                  return file
                }
                throw error
              }
            


        }
        
        downloadTask(file)
        return file

    }

    private validateURL(url: string): string {
      const urlFormat = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})\/([\w,.-]+\.csv)$/i;
      
      if (!urlFormat.test(url)) {
        throw new CustomError('invalid_url','Wrong URL format should be a csv file');
      }
    
       return url
    }


}