import express, { Request, Response, NextFunction } from 'express'
import { wrongEndpointMiddleware } from './middlewares/wrongEndpointMiddleware'
import files from './routes/files.route'

const app = express()
app.disable('x-powered-by')
app.use(express.json())



app.use('/api/v1/file', files)

app.use(wrongEndpointMiddleware)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      type: 'internal_server_error',
      message: 'Something went wrong! Please try again later.',
    });
    next();
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
  
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

export default app

