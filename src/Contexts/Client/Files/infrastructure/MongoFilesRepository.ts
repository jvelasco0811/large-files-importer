import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { File } from "../domain/File";
import { FileRepository } from "../domain/FileRepository";
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://fenix:1assWord3@localhost:27017';
const client = new MongoClient(MONGODB_URI);

// client.on('commandStarted', started => console.log(started));
// client.db().collection('pets');
// await client.insertOne({ name: 'spot', kind: 'dog' });

export class MongoFilesRepository implements FileRepository {
    public async save(chunk: string, fileId: string): Promise<void> {
    try {

        const collection = client.db('imported_files').collection(fileId);

        await collection.insertOne({ chunk });

    }

    catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } 

    }
}
