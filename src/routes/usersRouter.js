
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
router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.postLogin(req, res, next))
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.postRegister(req, res, next))
router.get('/:id', (req, res, next) => controller.show(req, res, next))
