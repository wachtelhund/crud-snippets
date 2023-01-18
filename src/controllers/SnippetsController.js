import hljs from 'highlight.js'
import { Snippet } from '../models/snippet.js'
/**
 * Module for the SnippetsController.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class SnippetsController {
  /**
   * Render snippets view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = await Snippet.find({})
      if (!viewData) {
        res.send('No snippets found')
      }
      res.render('snippets/index', { viewData, hljs })
    } catch (error) {
      next(error)
    }
  }

  async createForm (req, res, next) {
    try {
      res.render('snippets/create')
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      console.log(req.body);
      const tempData = {
        title: 'Testtitle',
        user: 'Testuser'
      }
      const snippet = new Snippet({ ...tempData, ...req.body })
      await snippet.save()
      res.redirect('./')
    } catch (error) {
      next(error)
    }
  }

  async show (req, res, next) {
    try {
      const { id } = req.params
      const viewData = await Snippet.findById(id)
      res.render('snippets/show', { viewData, hljs })
    } catch (error) {
      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      await Snippet.findByIdAndDelete(id)
      const viewData = await Snippet.find({})
      res.render('snippets/index', { viewData, hljs })
    } catch (error) {
      next(error)
    }
  }
}
