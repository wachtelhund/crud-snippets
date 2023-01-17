import express from 'express'
import createError from 'http-errors'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetsRouter } from './snippetsRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', snippetsRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(createError(404)))
