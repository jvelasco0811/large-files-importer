import express, { Request, Response } from 'express'
import files from './routes/files.route'

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
  
app.use('/api/v1/file', files)

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
