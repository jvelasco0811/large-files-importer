import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { File } from "../domain/File";
import { FileRepository } from "../domain/FileRepository";
const MONGODB_URI = process.env.MONGODB_URI || '';
console.log(MONGODB_URI)
console.log(process.env.LOCALT)
console.log(process.env.NODE_ENV)
const client = new MongoClient(MONGODB_URI);



export class MongoFilesRepository implements FileRepository {

    public async save(chunk: Buffer | Uint8Array, file: File): Promise<void> {
    try {
        console.log(MONGODB_URI)

        // update the file status in the collection status_imported_files database
        // await this.saveFileImportStatus(file);
        const importedFilesCollection = client.db('imported_files').collection(file.id);

        const document = this.parseChunks(chunk);

        await importedFilesCollection.insertOne({document});

    }

    catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } 

    }


    public async cancelFileImport(fileId: string): Promise<void> {
        console.log('Canceled')
    }

    private parseChunks(chunk: Buffer | Uint8Array): string {
        const decoder = new TextDecoder();
        let text = decoder.decode(chunk);
        // text = text.replace(/\n/g, ' ')
        
        return text;
    }
}
