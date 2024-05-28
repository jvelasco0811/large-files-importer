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
	} catch (error) {
		 res.status(404).json({ error: 'File import task not found' })
	}
}