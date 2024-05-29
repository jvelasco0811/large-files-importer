import request from "supertest"
import app from "../../src/app/app"
const api = request(app)
import { randomUUID } from 'node:crypto'
// const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
// const locationPattern = /^\/api\/v1\/file\/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\/status$/i;

// const url = 'https://public-vizz-storage.s3.amazonaws.com/backend/coding-challenges/large-file-importer/fhvhv_tripdata_2024-01.csv'


describe('Given a user want to Get Status', () => {
    describe('When send a Request to Get Status with a valid format', () => {
        it('Then it should return the File Importer Status', async () => {
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

    describe('When send a Request with invalid File import id', () => {
        it('Then it should return a error message with invalid file import id', async () => {
            // Given
            const token = 'invalid-tokenxx'
            const expectedError = {
                "type": "invalid_token",
                "message": "Invalid file id"
            }

            // When
            const statusResponse = await api.get(`/api/v1/file/${token}/status`);

            // Then
            expect(statusResponse.statusCode).toBe(400)
            expect(statusResponse.body).toEqual(expectedError)

        })
    })

    describe('When send a Request with not existing File import id', () => {
        it('Then it should return a error message with file not found', async () => {
            // Given
            const token = randomUUID()
            const expectedError = {
                "type": "file_not_found",
                "message": "File import not found"
            }

            // When
            const statusResponse = await api.get(`/api/v1/file/${token}/status`);

            // Then
            expect(statusResponse.statusCode).toBe(404)
            expect(statusResponse.body).toEqual(expectedError)

        })
    })

})




