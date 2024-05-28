export type FileStatus = 'running' | 'finished' | 'failed' | 'canceled'

export interface FileStatusResponse {
    token: string
    message?: string
    status?: string
    download_speed?: string
    downloaded?: string
    file_size?: string
    left?: string
}