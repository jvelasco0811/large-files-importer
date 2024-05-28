import { MongoClient, GridFSBucket } from 'mongodb';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import { File } from "../domain/File";
import { FileRepository } from "../domain/FileRepository";
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://fenix:1assWord3@localhost:27017';
const client = new MongoClient(MONGODB_URI);
export class MongoFilesRepository implements FileRepository {
    public async save(chunk: string): Promise<string | undefined> {
        try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Get a reference to the database
    const db = client.db('mydatabase');

    const bucket = new GridFSBucket(db);

    const uploadStream = bucket.openUploadStream('users');

    const readableStream = Readable.from(Buffer.from(chunk, 'utf-8'));
    readableStream.pipe(uploadStream);

    return new Promise<string>((resolve, reject) => {
        uploadStream.on('finish', () => {
            console.log('Chunk uploaded to MongoDB successfully');
            resolve(uploadStream.id.toString());
        });

        uploadStream.on('error', (error: any) => {
            console.error('Error uploading chunk to MongoDB:', error);
            reject(error);
        });
    });

          } catch (err) {
            console.error('Error connecting to MongoDB:', err);
          } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
          }

    }
}
