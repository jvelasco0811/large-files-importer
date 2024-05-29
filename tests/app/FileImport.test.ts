import request from "supertest"
import app from "../../src/app/app"
const api = request(app)
const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const locationPattern = /^\/api\/v1\/file\/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\/status$/i;

// const url = 'https://public-vizz-storage.s3.amazonaws.com/backend/coding-challenges/large-file-importer/fhvhv_tripdata_2024-01.csv'


describe('Given a user want to import a large file', () => {

    describe('When a request to Import a Large file is send', () => {
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

    describe('When a request with wrong URL format', () => {
        it('Then it should return a message notifying that the URL format its wrong', async () => {
            // Given
            const url = 'https://jv-data-big.s3.amazonaws.com/not-csv-file'
            const expectedError = {
                "type": "invalid_url_format",
                "message": "Wrong URL format should be a csv file"
            }

            // When
            const response = await api.post('/api/v1/file').send({ url });

            // Then
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(expectedError)
  
        })
    })

    describe('When a request with not existing file url', () => {
        it('Then it should return a message notifying the file not found', async () => {
            // Given
            const url = 'https://jv-data-big.s3.amazonaws.com/not-existing-file.csv'
            const expectedError = {
                "type": "request_error",
                "message": "File not exist"
            }

            // When
            const response = await api.post('/api/v1/file').send({ url });

            // Then
            expect(response.statusCode).toBe(404)
            expect(response.body).toEqual(expectedError)
  
        })
    })



})




