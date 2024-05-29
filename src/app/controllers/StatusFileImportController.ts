import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { StatusFileImport } from '../../Contexts/Client/Files/application/StatusFileImport'
import { MemoryFileRepository } from '../../Contexts/Client/Files/infrastructure/MemoryFileRepository'

const memoryFileRepository: MemoryFileRepository = new MemoryFileRepository()

export const StatusFileImportController = async (req: Request, res: Response) => {
	const { fileImportId } = req.params;

	try {
		
		const statusFileImport = new StatusFileImport(fileImportId, memoryFileRepository)
		const fileStatus = await statusFileImport.run()

		
		res.status(200).json({
			id: fileStatus.id,
			status: fileStatus.status,
			downloadSpeed: fileStatus.downloadSpeed,
			downloaded: fileStatus.downloaded,
			fileSize: fileStatus.fileSize,
			downloadProgress: fileStatus.downloadProgress,
			eta: fileStatus.eta,

		});
	} catch (error: any) {

		if(error.type === 'invalid_token') {
			
			res.status(400).json({ type: error.type, message: error.message })
		}
		if(error.type === 'file_not_found') {
			
			res.status(404).json({ type: error.type, message: error.message })
		}

	}
}



