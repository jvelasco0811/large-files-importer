export type FileStatus = 'running' | 'finished' | 'failed' | 'canceled'

export interface ResponseFileImport {
    
    token: string
    location: string

}

export interface ResponseFileImportStatus {

    id: string
    status: string
    download_speed: string
    downloaded: string
    file_size: string
    download_progress: string
    left: string

}

