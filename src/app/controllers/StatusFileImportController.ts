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
		// const task = fileImportTasks[fileImportId];

		// if (!task) {
		//   res.status(404).json({ error: 'File import task not found' });
		//   return;
		// }
		
		res.status(200).json({
			id: fileStatus.id,
			status: fileStatus.status,
			downloadSpeed: fileStatus.downloadSpeed,
			downloaded: fileStatus.downloaded,
			fileSize: fileStatus.fileSize,
			downloadProgress: fileStatus.downloadProgress,
			eta: fileStatus.eta,

		});
	} catch (error) {
		 res.status(404).json({ error: 'File import task not found' })
	}
}



