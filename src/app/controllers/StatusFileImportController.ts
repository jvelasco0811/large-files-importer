import { Request, Response } from 'express'
import { File } from '../../Contexts/Client/Files/domain/File'
import { StatusFileImport } from '../../Contexts/Client/Files/application/StatusFileImport'
import { MemoryFileRepository } from '../../Contexts/Client/Files/infrastructure/MemoryFileRepository'
import { ResponseFileImportStatus } from '../../Contexts/Client/Files/shared/types'

const memoryFileRepository: MemoryFileRepository = new MemoryFileRepository()

export const StatusFileImportController = async (req: Request, res: Response) => {
	const { fileImportId } = req.params;

	try {
		
		const statusFileImport = new StatusFileImport(fileImportId, memoryFileRepository)
		const fileStatus = await statusFileImport.run()

		const response: ResponseFileImportStatus = {
			id: fileStatus.id,
			status: fileStatus.status,
			download_speed: fileStatus.downloadSpeed,
			downloaded: fileStatus.downloaded,
			file_size: fileStatus.fileSize,
			download_progress: fileStatus.downloadProgress,
			left: fileStatus.eta,
		}

		res.status(200).json(response);
		
	} catch (error: any) {

		res.status(error.code).json({ type: error.type, message: error.message }).end()

	}
}



