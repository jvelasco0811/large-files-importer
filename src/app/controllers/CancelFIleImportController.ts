import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { CancelFileImport } from '../../Contexts/Client/Files/application/CancelFileImport'
import { MemoryFileRepository } from '../../Contexts/Client/Files/infrastructure/MemoryFileRepository'
import { ResponseFileImportStatus } from '../../Contexts/Client/Files/shared/types'

const memoryFileRepository: MemoryFileRepository = new MemoryFileRepository()

export const CancelFileImportController = async (req: Request, res: Response) => {
	const { fileImportId } = req.params;

	try {
		
		const cancelFileImport = new CancelFileImport(fileImportId, memoryFileRepository)
		const canceledFile = await cancelFileImport.run()

		const response: ResponseFileImportStatus = {
			id: canceledFile.id,
			status: canceledFile.status,
			download_speed: canceledFile.downloadSpeed,
			downloaded: canceledFile.downloaded,
			file_size: canceledFile.fileSize,
			download_progress: canceledFile.downloadProgress,
			left: canceledFile.eta,
		}
		
		res.status(200).json(response)

	} catch (error: any) {

		res.status(error.code).json({ type: error.type, message: error.message }).end()

	}
}