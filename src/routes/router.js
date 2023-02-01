import express from 'express'
import createError from 'http-errors'
import { router as homeRouter } from './homeRouter.js'
import { router as snippetsRouter } from './snippetsRouter.js'
import { router as usersRouter } from './usersRouter.js'
/**
 * Main router.
 */
export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', snippetsRouter)
router.use('/users', usersRouter)

router.use('*', (req, res, next) => next(createError(404)))
