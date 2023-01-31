/**
 * Home routes.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

import express from 'express'
import { UsersController } from '../controllers/UsersController.js'

export const router = express.Router()

const controller = new UsersController()

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
    res.redirect('/users/')
  }
}

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/delete', controller.isLoggedIn, (req, res, next) => controller.delete(req, res, next))
router.post('/logout', controller.isLoggedIn, (req, res, next) => controller.logout(req, res, next))
router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.postLogin(req, res, next))
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.postRegister(req, res, next))
router.get('/:id', (req, res, next) => controller.show(req, res, next))
