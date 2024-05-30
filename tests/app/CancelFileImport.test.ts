import request from "supertest"
import { randomUUID } from 'node:crypto'
import app from "../../src/app/app"

const api = request(app)

describe('Given a user want to Cancel the Import', () => {
    describe('When a DELETE request is send', () => {
        it('Then it should cancel the File Import', async () => {
            // Given
            // create a fake csv file with fake data of 50000 lines and save it in /tmp os dir
            const url = 'https://jv-data-big.s3.amazonaws.com/fhvhv_tripdata_2024-01.csv'
            const response = await api.post('/api/v1/file').send({ url });
            const token = response.body.token
            const expectedToken =  token       
            const expectedStatus =  'canceled'

            // When
            const cancelResponse = await api.delete(`/api/v1/file/${token}/cancel`);
 
            // Then
            expect(cancelResponse.statusCode).toBe(200)
            expect(cancelResponse.body.id).toBe(expectedToken)
            expect(cancelResponse.body.status).toBe(expectedStatus)
        })
    })

    describe('When send a Cancel Request with invalid File import id', () => {
        it('Then it should return a error message with invalid file import id', async () => {
            // Given
            const token = 'invalid-tokenxx'
            const expectedError = {
                "type": "invalid_token",
                "message": "Invalid file id"
            }

            // When
            const statusResponse = await api.delete(`/api/v1/file/${token}/cancel`);

            // Then
            expect(statusResponse.statusCode).toBe(400)
            expect(statusResponse.body).toEqual(expectedError)

        })
    })

    describe('When send a Cancel Request with not existing File import id', () => {
        it('Then it should return a error message with file not found', async () => {
            // Given
            const token = randomUUID()
            const expectedError = {
                "type": "file_not_found",
                "message": "File import not found"
            }

            // When
            const statusResponse = await api.delete(`/api/v1/file/${token}/cancel`);

            // Then
            expect(statusResponse.statusCode).toBe(404)
            expect(statusResponse.body).toEqual(expectedError)

        })
    })
})



