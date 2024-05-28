import { Router } from 'express'
import { FileImportController } from '../controllers/FileImportController'
import { StatusFileImportController } from '../controllers/StatusFileImportController'
import { CancelFileImportController } from '../controllers/CancelFIleImportController'

const router = Router()

router.post('/', FileImportController)

router.get('/:fileImportId/status', StatusFileImportController)

router.delete('/:fileImportId/cancel', CancelFileImportController)

export default router