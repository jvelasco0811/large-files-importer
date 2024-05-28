import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { File } from "../domain/File";
import { FileRepository } from "../domain/FileRepository";
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://fenix:1assWord3@localhost:27017';
const client = new MongoClient(MONGODB_URI);



export class MongoFilesRepository implements FileRepository {
    public async saveFileImportStatus(file: File): Promise<void> {
        try {
            // chekf if the file.id exist if not create a new collection with the file.id
            const fileExist = await this.findFileStatusByID(file.id);
            if (fileExist) {
                // update the document downloadSpeed, downloaded, fileSize, downloadProgress, eta
                const collection = client.db('status_imported_files').collection(file.id);
                await collection.updateOne({}, {$set: {downloadSpeed: file.downloadSpeed, downloaded: file.downloaded, fileSize: file.fileSize, downloadProgress: file.downloadProgress, eta: file.eta}});
                console.log('File status updated');
                return;
            }

            const collection = client.db('status_imported_files').collection('files_status');
            // save the file inthe collection and the mongo _id will be the file.id

              await collection.insertOne(file);
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }
    }

    public async save(chunk: Buffer | Uint8Array, file: File): Promise<void> {
    try {

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

    public async findFileStatusByID(fileId: string): Promise<String | null> {
        try {
            const collection = client.db('status_imported_files').collection(fileId);
            const fileStatus = await collection.findOne({document: {$exists: true}});

            if (!fileStatus) {
                return null;
            }

            // const file = new File(fileId, fileStatus.document.length);

            return fileId;
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            return null;
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
