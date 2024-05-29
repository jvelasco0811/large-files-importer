import request from "supertest"
import app from "../../src/app/app"
const api = request(app)



describe('Given a user want to the app endpoint', () => {

    describe('When a request to no existing endpoint', () => {
        it('Then it should return status 404 not found', async () => {
            // Given
            const endpoint = 'no-valid-endpoint'

            // When
            const response = await api.get(`/api/v1/file/${endpoint}`)
            const expectedError = 'oops not found'
            // Then
            expect(response.statusCode).toBe(404)
            expect(response.body).toEqual({ error: expectedError })
   
  
        })
    })






})




