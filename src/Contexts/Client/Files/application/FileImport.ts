import { errorMonitor } from "supertest/lib/test";
import { File } from "../domain/File";
import { FileRepository, FileRepositoryMem } from "../domain/FileRepository";
import fs from "node:fs"
import { Readable } from 'node:stream';


export class FileImport {

    readonly url: string

    constructor(url: string, private fileRepository: FileRepository, private memoryFileRepository: FileRepositoryMem ) {
        this.url = url
    }
    
    async run(): Promise<File> {

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
                const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
    
                // const writer = fs.createWriteStream(file.filePath);

                // console.log("## NEW ARRAY ##", this.memoryFileRepository.getAllFiles())

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
            catch (err: any) {
                if(err.name === 'AbortError') {
                  console.log('Download canceled')
                  return
                }
                else {
                  console.log(`Error in async iterator: ${err}.`);
                  file.updateFileStatus('failed');
                }
              }
            


        }
        
        downloadTask(file)
        return file

    }


}