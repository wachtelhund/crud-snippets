/**
 * Home routes.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */
import express from 'express'
import createHttpError from 'http-errors'
import { SnippetsController } from '../controllers/SnippetsController.js'
import { Snippet } from '../models/snippet.js'

export const router = express.Router()

const controller = new SnippetsController()

controller.isLoggedIn = (req, res, next) => {
  if (req.session.username) {
    next()
  } else {
    res.redirect('/users/login')
  }
}

controller.isOwner = async (req, res, next) => {
  const { id } = req.params
  const snippet = await Snippet.findById(id)
  if (snippet.user === req.session.username) {
    next()
  } else if (req.session.username) {
    next(createHttpError(403, 'You are not the owner of this snippet.'))
  } else {
    next(createHttpError(404))
  }
}

// Map HTTP verbs and route paths to controller actions.
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/create', controller.isLoggedIn, (req, res, next) => controller.createForm(req, res, next))
router.post('/create', controller.isLoggedIn, (req, res, next) => controller.create(req, res, next))
router.get('/:id', controller.isOwner, (req, res, next) => controller.show(req, res, next))
router.post('/:id/delete', controller.isOwner, (req, res, next) => controller.delete(req, res, next))
router.get('/:id/edit', controller.isOwner, (req, res, next) => controller.editForm(req, res, next))
router.post('/:id/update', controller.isOwner, (req, res, next) => controller.update(req, res, next))
