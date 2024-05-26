import request from "supertest"
import app from "../../src/app/app"
const api = request(app)
const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const locationPattern = /^\/api\/v1\/file\/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\/status$/i;

// const url = 'https://public-vizz-storage.s3.amazonaws.com/backend/coding-challenges/large-file-importer/fhvhv_tripdata_2024-01.csv'


describe('Given a request to import a large file', () => {
    describe('When a POST request is send to /api/v1/file', () => {
        it('Then it should return a message with token and location', async () => {
            // Given
            const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.csv'

            // When
            const response = await api.post('/api/v1/file').send({ url });
            const token = response.body.token

            // Then
            expect(response.statusCode).toBe(200)
            expect(uuidv4Regex.test(response.body.token)).toBe(true)
            expect(locationPattern.test(response.body.location)).toBe(true)
            await api.delete(`/api/v1/file/${token}/cancel`);  
  
        })
    })
})

describe('Given a request to get status of a large file', () => {
    describe('When a GET request is send to /api/v1/file/{token}/status', () => {
        it('Then it should return a message with the status of file imported', async () => {
            // Given
            // create a fake csv file with fake data of 50000 lines and save it in /tmp os dir
            const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.csv'           
            const response = await api.post('/api/v1/file').send({ url });
            const token = response.body.token
            

            // When
            const statusResponse = await api.get(`/api/v1/file/${token}/status`);

            // Then
            expect(statusResponse.statusCode).toBe(200)
            expect(statusResponse.body.status).toBe('running')
            await api.delete(`/api/v1/file/${token}/cancel`);            

        })
    })
})

describe('Given a request to cancel the import of a large file', () => {
    describe('When a DELETE request is send to /api/v1/file/{token}/cancel', () => {
        it('Then it should return a message of the import has been canceled', async () => {
            // Given
            // create a fake csv file with fake data of 50000 lines and save it in /tmp os dir
            const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.csv'
            const response = await api.post('/api/v1/file').send({ url });
            const token = response.body.token
            const expected =  { message: 'File import task canceled' }       

            // When
            const cancelResponse = await api.delete(`/api/v1/file/${token}/cancel`);

            // Then
            expect(cancelResponse.statusCode).toBe(200)
            expect(cancelResponse.body).toEqual(expected)
        })
    })
})



