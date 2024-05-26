import { randomUUID } from 'node:crypto'

const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.csv'


const download = async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    
    const totalSize = parseInt(response.headers.get('content-length'), 10);
    let downloadedSize = 0;

    const reader = response.body.getReader();
    console.log(reader)

    console.log(response)
    console.log(totalSize)
    
    // response.body.on('data', (chunk) => {
    //     downloadedSize += chunk.length;
    //     progressCallback(downloadedSize, totalSize);
    //   });

}

const uuidGen = () => {
    const uuid = randomUUID()
    console.log(uuid)
}

uuidGen()