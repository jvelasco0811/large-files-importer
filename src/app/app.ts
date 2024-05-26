import express, { Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
const app = express()
app.disable('x-powered-by')
app.use(express.json())

// In-memory store for file import tasks
interface FileImportTask {
	id: string;
	status: 'running' | 'finished' | 'failed' | 'canceled';
	filePath: string;
	downloadSpeed?: string;
	downloaded?: string;
	fileSize?: string;
	downloadProgress?: string;
	eta?: string;
	cancel: () => void;
  }
  
  const fileImportTasks: Record<string, FileImportTask> = {};
  

app.post('/api/v1/file', async (req: Request, res: Response) => {
	const { url } = req.body

	// create a random id for the file import
	const fileImportId = randomUUID()
	const location = `/api/v1/file/${fileImportId}/status`

	// create a file .csv in the temp directory
	const filePath = `${os.tmpdir()}/${fileImportId}.csv`

	 // Start the file download and write in the background
	 let downloadTaskController: AbortController | null = null;
	 const downloadTask = new Promise((resolve, reject) => {
		downloadTaskController = new AbortController();
		fetch(url, { signal: downloadTaskController.signal })
		  .then((response) => {
			const totalSize = parseInt(response.headers.get('content-length') || '0', 10);
			let downloadedSize = 0;
			let downloadedSizeMB = 0;
			const startTime = Date.now();
	
			const writer = fs.createWriteStream(filePath);
	
			const reader = response.body.getReader();
			reader.read().then(function processData({ done, value }) {
			  if (done) {
				writer.end();
				resolve();
				return;
			  }
	
			  writer.write(value);
			  downloadedSize += value.length;
			  downloadedSizeMB = +((downloadedSize / 1024 / 1024).toFixed(1));

			  const remainingFileSizeMB = +((totalSize - downloadedSize) / 1024 / 1024).toFixed(1);
			  
			  const downloadProgress = `${Math.floor((downloadedSize / totalSize) * 100)} %`
			  const elapsedTime = (Date.now() - startTime) / 1000;
			  
			  const downloadSpeedMB = +(downloadedSize / elapsedTime / 1024 / 1024).toFixed(1)
			  const fileSizeMB = +((totalSize / 1024 / 1024).toFixed(1));
			  const eta = `${Math.floor(remainingFileSizeMB / downloadSpeedMB )} seconds`;

			  fileImportTasks[fileImportId].downloadSpeed = `${downloadSpeedMB} MB/s`;
			  fileImportTasks[fileImportId].downloaded = `${downloadedSizeMB} MB`;
			  fileImportTasks[fileImportId].fileSize = `${fileSizeMB} MB`;
			  fileImportTasks[fileImportId].downloadProgress = downloadProgress;
			  fileImportTasks[fileImportId].eta = eta;
	
	
			  return reader.read().then(processData);
			}).catch(reject);
		  })
		  .catch(reject);
	  });

	  // save the file import task in the in-memory store
	  fileImportTasks[fileImportId] = {
		id: fileImportId,
		status: 'running',
		filePath,
		cancel: () => {
			if (downloadTaskController) {
			  downloadTaskController.abort();
			  fileImportTasks[fileImportId].status = 'canceled';
			}
		}
	  };
	  
	  // send response with the file import id and location
	  res.status(200).json({
		  token: fileImportId,
		  location,
		});  
	try {

		await downloadTask;
		fileImportTasks[fileImportId].status = 'finished'
	

	  } catch (err: any) {
		if (err.name === 'AbortError') {
			console.log('Download canceled');
			return;
		  }
		fileImportTasks[fileImportId].status = 'failed';
		res.status(500).json({ error: 'Error downloading and writing file' });
	  }
})

app.get('/api/v1/file/:fileImportId/status', (req: Request, res: Response) => {
	const { fileImportId } = req.params;
	const task = fileImportTasks[fileImportId];
  
	if (!task) {
	  res.status(404).json({ error: 'File import task not found' });
	  return;
	}
  
	res.status(200).json(task);
  });

app.delete('/api/v1/file/:fileImportId/cancel', (req: Request, res: Response) => {
	const { fileImportId } = req.params;
	const task = fileImportTasks[fileImportId];
  
	if (!task) {
	  res.status(404).json({ error: 'File import task not found' });
	  return;
	}
  
	if (task.status === 'running') {
	  task.cancel();
	  res.status(200).json({ message: 'File import task canceled' });
	} else {
	  res.status(400).json({ error: 'File import task cannot be canceled in the current state' });
	}
});
  
  

export default app
