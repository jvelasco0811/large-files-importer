import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { FileImport } from '../../Contexts/Client/Files/application/FileImport'
import { MongoFilesRepository } from '../../Contexts/Client/Files/infrastructure/MongoFilesRepository'
import { MemoryFileRepository } from '../../Contexts/Client/Files/infrastructure/MemoryFileRepository'

const mongoFilesRepository: MongoFilesRepository = new MongoFilesRepository()
const memoryFileRepository: MemoryFileRepository = new MemoryFileRepository()

export const FileImportController = async (req: Request, res: Response) => {
	const { url } = req.body

	try {

		const fileImport = new FileImport(url, mongoFilesRepository, memoryFileRepository)
		const file: File = await fileImport.run()
		
		res.status(200).json({
			token: file.id,
			location: file.location,
		  });  

	  } catch (err: any) {
		if (err.name === 'AbortError') {
			console.log('Download canceled');
			return;
		  }

		  res.status(500).json({ error: 'Error downloading and writing file' });
	  }
}