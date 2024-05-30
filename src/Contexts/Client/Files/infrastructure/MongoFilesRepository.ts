import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import { File } from "../domain/File";
import { FileRepository } from "../domain/FileRepository";
import { ErrorHandler } from "../shared/ErrorHandler";
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new ErrorHandler('config_error', 'MongoDB URI is not defined in environment variables', 500);
}

let client: MongoClient;

try {
    client = new MongoClient(MONGODB_URI);
    client.connect().then(() => {
        if(process.env.NODE_ENV !== 'test') {
            console.log('Connected to MongoDB')
        }
    }).catch((error: any) => {
        throw new ErrorHandler('mongodb_connection_error', `Failed to connect to MongoDB: ${error.message}`, 500);
    });
} catch (error: any) {
    throw new ErrorHandler('config_error', `Invalid MongoDB URI: ${error.message}`, 500);
}

export class MongoFilesRepository implements FileRepository {

    public async save(chunk: Buffer | Uint8Array, file: File): Promise<void> {
        try {

            const importedFilesCollection = client.db('imported_files').collection(file.id);

            const document = this.parseChunks(chunk);

            await importedFilesCollection.insertOne({ document });
        } catch (error: any) {
            if (error instanceof ErrorHandler) {
                throw error;
            } else {
                throw new ErrorHandler('mongodb_error', `Error saving chunk to MongoDB: ${error.message}`, 500);
            }
        }
    }

    public async cancelFileImport(fileId: string): Promise<void> {
        try {
            const importedFilesCollection = client.db('imported_files').collection(fileId);
            await importedFilesCollection.deleteMany({});
            console.log('File import canceled and all associated data removed');
        } catch (error: any) {
            throw new ErrorHandler('mongodb_error', `Error canceling file import: ${error.message}`, 500);
        }
    }

    private parseChunks(chunk: Buffer | Uint8Array): string {
        const decoder = new TextDecoder();
        return decoder.decode(chunk);
    }
}
