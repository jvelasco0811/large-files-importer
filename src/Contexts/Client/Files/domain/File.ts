import { randomUUID } from 'node:crypto'
import os from 'node:os'
import { calculateImportStatus } from './calculateImportStatus'

export class File {
    public readonly id: string
    public status: 'running' | 'finished' | 'failed' | 'canceled'
    public readonly filePath: string
    public readonly location: string
    public cancel: VoidFunction
    public downloadSpeed: any
    public downloaded: any
    public fileSize: any
    public downloadProgress: any
    public eta: any

    constructor(id: string, status: 'running' | 'finished' | 'failed' | 'canceled', filePath: string, location: string)
    {    
        this.id = id
        this.status = status
        this.filePath = filePath
        this.location = location
        this.cancel = () => {}
 
    }
   
    static create(): File {
        // Generate a unique ID for the task
        const id = randomUUID()
        const filePath = `${os.tmpdir()}/${id}.csv`
        const location = `/api/v1/file/${id}/status`
        return new File(id, 'running', filePath, location)

      }

    
    public updateStatus(chunk: number, totalSize: number): void {


        const importStatus = calculateImportStatus(chunk, totalSize)

        this.downloadSpeed = importStatus.downloadSpeedMB
        this.downloaded = importStatus.downloadedSizeMB
        this.fileSize = importStatus.fileSizeMB
        this.downloadProgress = importStatus.downloadProgress
        this.eta = importStatus.eta

    }

    public importStatus(): object {
        return {
            
            downloadSpeed: this.downloadSpeed,
            downloaded: this.downloaded,
            fileSize: this.fileSize,
            downloadProgress: this.downloadProgress,
            eta: this.eta
        }
    }

    public updateFileStatus(status: 'running' | 'finished' | 'failed' | 'canceled'): void {
        this.status = status
    }

}