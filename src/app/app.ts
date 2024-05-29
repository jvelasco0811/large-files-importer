import express, { Request, Response } from 'express'
import { wrongEndpointMiddleware } from './middlewares/wrongEndpointMiddleware'
import files from './routes/files.route'

const app = express()
app.disable('x-powered-by')
app.use(express.json())



app.use('/api/v1/file', files)

app.use(wrongEndpointMiddleware)



  
  

export default app

