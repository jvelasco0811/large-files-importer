import { Router } from 'express'
import { FileImportController } from '../controllers/FileImportController'

const router = Router()

router.post('/', FileImportController)

export default router