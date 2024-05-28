import { File } from "../domain/File";
import { FileRepository } from "../domain/FileRepository";
import fs from "node:fs"
import { Readable } from 'node:stream';


export class FileImport {

    readonly url: string

    constructor(url: string, private fileRepository: FileRepository) {
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

                const response = await fetch(this.url, { signal: downloadTaskController.signal })
                const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
    
                const writer = fs.createWriteStream(file.filePath);
                const decoder = new TextDecoder();
    
                for await (const chunk of response.body) {
                    // if (signal.aborted) throw signal.reason;
                    // Do something with the chunk

                    file.updateStatus(chunk.length, totalSize)

                    let text = decoder.decode(chunk);
                    text = text.replace(/\n/g, ' ')
                    // writer.write(text);
                    
                    this.fileRepository.save(text, file.id)

                }


  
            }
            catch (e) {
                if (e instanceof TypeError) {
                  console.log(e);
                  console.log("TypeError: Browser may not support async iteration");
                } else {
                  console.log(`Error in async iterator: ${e}.`);
                }
              }
            


        }
        
        downloadTask(file)
        return file

    }


}