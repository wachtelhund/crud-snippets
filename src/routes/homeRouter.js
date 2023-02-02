import express from 'express'
import { HomeController } from '../controllers/HomeController.js'

/**
 * Home routes.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */
export const router = express.Router()

const controller = new HomeController()

router.get('/', (req, res, next) => controller.index(req, res, next))
