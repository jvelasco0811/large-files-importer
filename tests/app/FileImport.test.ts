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

    describe('When a POST request is send to /api/v1/file with wrong URL format', () => {
        it('Then it should return a message notifying that the URL format its wrong', async () => {
            // Given
            const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.xed'
            const errorMessage = {
                "type": "invalid_url",
                "message": "Wrong URL format should be a csv file"
            }

            // When
            const response = await api.post('/api/v1/file').send({ url });
            const token = response.body.token

            // Then
            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual(errorMessage)
  
        })
    })

    // describe('When a POST request is send to /api/v1/file with file that not exist', () => {
    //     it('Then it should return a message notifying that the URL format its wrong', async () => {
    //         // Given
    //         const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-02.csv'
    //         const errorMessage = {
    //             "type": "request_error",
    //             "message": "Wrong URL format should be a csv file"
    //         }

    //         // When
    //         const response = await api.post('/api/v1/file').send({ url });
    //         const token = response.body.token

    //         // Then
    //         expect(response.statusCode).toBe(404)
    //         expect(response.body).toEqual(errorMessage)
  
    //     })
    // })



})




