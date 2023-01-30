
/**
 * Home routes.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

import express from 'express'
import { SnippetsController } from '../controllers/SnippetsController.js'

export const router = express.Router()

const controller = new SnippetsController()

controller.authorize = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/users/login')
  }
}

// Map HTTP verbs and route paths to controller actions.
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/create', (req, res, next) => controller.createForm(req, res, next))
router.post('/create', (req, res, next) => controller.create(req, res, next))
router.get('/:id', (req, res, next) => controller.show(req, res, next))
router.post('/:id/delete', (req, res, next) => controller.delete(req, res, next))
router.get('/:id/edit', (req, res, next) => controller.editForm(req, res, next))
router.post('/:id/update', (req, res, next) => controller.update(req, res, next))
