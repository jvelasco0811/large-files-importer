import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { CancelFileImport } from '../../Contexts/Client/Files/application/CancelFileImport'
import { MemoryFileRepository } from '../../Contexts/Client/Files/infrastructure/MemoryFileRepository'

const memoryFileRepository: MemoryFileRepository = new MemoryFileRepository()

export const CancelFileImportController = async (req: Request, res: Response) => {
	const { fileImportId } = req.params;

	try {
		
		const cancelFileImport = new CancelFileImport(fileImportId, memoryFileRepository)
		const canceledFile = await cancelFileImport.run()

		
		res.status(200).json({
			id: canceledFile.id,
			status: canceledFile.status,
			downloadSpeed: canceledFile.downloadSpeed,
			downloaded: canceledFile.downloaded,
			fileSize: canceledFile.fileSize,
			downloadProgress: canceledFile.downloadProgress,
			eta: canceledFile.eta,

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