import request from "supertest"
import app from "../../src/app/app"
const api = request(app)
const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const locationPattern = /^\/api\/v1\/file\/[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\/status$/i;

// const url = 'https://public-vizz-storage.s3.amazonaws.com/backend/coding-challenges/large-file-importer/fhvhv_tripdata_2024-01.csv'


describe('Given a request to cancel the import of a large file', () => {
    describe('When a DELETE request is send to /api/v1/file/{token}/cancel', () => {
        it('Then it should return a message of the import has been canceled', async () => {
            // Given
            // create a fake csv file with fake data of 50000 lines and save it in /tmp os dir
            const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.csv'
            const response = await api.post('/api/v1/file').send({ url });
            const token = response.body.token
            const expected =  { id: token, status: 'canceled' }       

            // When
            const cancelResponse = await api.delete(`/api/v1/file/${token}/cancel`);

            // Then
            expect(cancelResponse.statusCode).toBe(200)
            expect(cancelResponse.body).toEqual(expected)
        })
    })
})



