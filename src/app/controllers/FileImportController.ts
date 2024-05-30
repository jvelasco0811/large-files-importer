import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { FileImport } from '../../Contexts/Client/Files/application/FileImport'
import { MongoFilesRepository } from '../../Contexts/Client/Files/infrastructure/MongoFilesRepository'
import { MemoryFileRepository } from '../../Contexts/Client/Files/infrastructure/MemoryFileRepository'
import { ResponseFileImport } from '../../Contexts/Client/Files/shared/types'

const mongoFilesRepository: MongoFilesRepository = new MongoFilesRepository()
const memoryFileRepository: MemoryFileRepository = new MemoryFileRepository()

export const FileImportController = async (req: Request, res: Response) => {
	const { url } = req.body

	
	try {
		
		const fileImport = new FileImport(url, mongoFilesRepository, memoryFileRepository)
		const file: File = await fileImport.run()

		const response: ResponseFileImport = {
			token: file.id,
			location: file.location,
		}

		res.status(200).json(response);  

	} catch (error: any) {
		
		  res.status(error.code).json({ type: error.type, message: error.message }).end()

	
		  
	  }
}