import express, { Request, Response } from 'express'
import files from './routes/files.route'

const app = express()
app.disable('x-powered-by')
app.use(express.json())


  
app.use('/api/v1/file', files)

  
  

export default app

