import express, { Request, Response } from 'express'

const app = express()
app.disable('x-powered-by')
app.use(express.json())

app.use('/health', (_req: Request, res: Response) => {
	res.send({ msg: 'Server up' })
})

export default app
