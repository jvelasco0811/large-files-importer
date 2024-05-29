import { Request, Response } from 'express'

export const wrongEndpointMiddleware = (_req: Request, res: Response) => {
    res.status(404).send({ error: 'oops not found' })
}