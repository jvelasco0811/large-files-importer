import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { FileImport } from '../../Contexts/Client/Files/application/FileImport'
import { MongoFilesRepository } from '../../Contexts/Client/Files/infrastructure/MongoFilesRepository'

const mongoFilesRepository: MongoFilesRepository = new MongoFilesRepository()

export const FileImportController = async (req: Request, res: Response) => {
	const { url } = req.body

	try {

		// await downloadTask;
		// fileImportTasks[fileImportId].status = 'finished'
	
		const fileImport = new FileImport(url, mongoFilesRepository)
		const file: File = await fileImport.run()
		
		// send response with the file import id and location
		res.status(200).json({
			token: file.id,
			location: file.location,
		  });  

	  } catch (err: any) {
		if (err.name === 'AbortError') {
			console.log('Download canceled');
			return;
		  }
		// fileImportTasks[fileImportId].status = 'failed';
		res.status(500).json({ error: 'Error downloading and writing file' });
	  }
}