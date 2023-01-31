/**
 * Home routes.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */
import express from 'express'
import createError from 'http-errors'
import { SnippetsController } from '../controllers/SnippetsController.js'
import { Snippet } from '../models/snippet.js'

export const router = express.Router()

const controller = new SnippetsController()

/**
 * Middleware to check if user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
controller.isLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next()
  } else {
    // next(createHttpError(404))
    res.redirect('../users')
  }
}

/**
 * Middleware to check if user owns a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
controller.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params
    const snippet = await Snippet.findById(id)
    if (snippet.user === req.session.username) {
      next()
    } else if (req.session.username) {
      next(createError(403, 'You are not the owner of this snippet.'))
    }
  } catch (error) {
    next(createError(404, 'Snippet not found.'))
  }
}

router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/create', controller.isLoggedIn, (req, res, next) => controller.createForm(req, res, next))
router.post('/create', controller.isLoggedIn, (req, res, next) => controller.create(req, res, next))
router.get('/:id', controller.isOwner, (req, res, next) => controller.show(req, res, next))
router.post('/:id/delete', controller.isOwner, (req, res, next) => controller.delete(req, res, next))
router.get('/:id/edit', controller.isOwner, (req, res, next) => controller.editForm(req, res, next))
router.post('/:id/update', controller.isOwner, (req, res, next) => controller.update(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))
