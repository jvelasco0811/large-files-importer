import { randomUUID } from 'node:crypto'
import os from 'node:os'
import { calculateImportStatus } from './calculateImportStatus'
import { FileStatus } from '../shared/types'

export class File {
    public readonly id: string
    public status: FileStatus
    public readonly filePath: string
    public readonly location: string
    public cancel: VoidFunction
    public downloadSpeed: any
    public downloaded: any
    public fileSize: any
    public downloadProgress: any
    public eta: any

    constructor(id: string, status: FileStatus, filePath: string, location: string)
    {    
        this.id = id
        this.status = status
        this.filePath = filePath
        this.location = location
        this.cancel = () => {}
        this.downloadSpeed = '0 MB/s'
        this.downloaded = '0 MB'
        this.fileSize = '0 MB'
        this.downloadProgress = '0 MB'
        this.eta = '0 seconds'
 
    }
   
    static create(): File {
        // Generate a unique ID for the task
        const id = randomUUID()
        const filePath = `${os.tmpdir()}/${id}.csv`
        const location = `/api/v1/file/${id}/status`
        return new File(id, 'running', filePath, location)

      }

    
    public async updateStatus(chunk: number, totalSize: number): Promise<void> {


        const importStatus = await calculateImportStatus(chunk, totalSize)

        this.downloadSpeed = importStatus.downloadSpeedMB
        this.downloaded = importStatus.downloadedSizeMB
        this.fileSize = importStatus.fileSizeMB
        this.downloadProgress = importStatus.downloadProgress
        this.eta = importStatus.eta

    }

    public updateFileStatus(status: FileStatus): void {
        this.status = status
    }

}