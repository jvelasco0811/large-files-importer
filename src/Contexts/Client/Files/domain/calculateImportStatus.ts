let downloadedSize = 0;
let downloadedSizeMB = 0;
const startTime = Date.now();

export const calculateImportStatus = (chunkLength: number, totalSize: number) => {
  downloadedSize += chunkLength;

  downloadedSizeMB = +((downloadedSize / 1024 / 1024).toFixed(1));
  
  const remainingFileSizeMB = +((totalSize - downloadedSize) / 1024 / 1024).toFixed(1);
  
  const downloadProgress = Math.floor((downloadedSize / totalSize) * 100)
  const elapsedTime = (Date.now() - startTime) / 1000;
  
  const downloadSpeedMB = +(downloadedSize / elapsedTime / 1024 / 1024).toFixed(1)
  const fileSizeMB = +((totalSize / 1024 / 1024).toFixed(1));
  const eta = Math.floor(remainingFileSizeMB / downloadSpeedMB )

  return {
    downloadSpeedMB: `${downloadSpeedMB} MB/s`,
    downloadedSizeMB: `${downloadedSizeMB} MB`,
    fileSizeMB: `${fileSizeMB} MB`,
    downloadProgress: `${downloadProgress} %`,
    eta: `${eta} seconds`
  }

}