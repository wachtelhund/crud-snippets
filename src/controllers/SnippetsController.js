import hljs from 'highlight.js'
import { Snippet } from '../models/snippet.js'
/**
 * Module for the SnippetsController.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

/**
 * Snippets controller.
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
      // TODO: Use map to select specific fields.
      const viewData = await Snippet.find({})
      if (!viewData) {
        res.send('No snippets found')
      }
      viewData.activeUser = req.session.username
      res.render('snippets/index', { viewData, hljs })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method for getting creation form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createForm (req, res, next) {
    try {
      res.render('snippets/create')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method for getting edit form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async editForm (req, res, next) {
    try {
      const { id } = req.params
      const viewData = await Snippet.findById(id)
      res.render('snippets/edit', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Takes a multiline code string and inserts line numbers.
   *
   * @param {string} code The code to add line numbers to.
   * @returns {string} The code with line numbers.
   */
  addLineNumbers = (code) => {
    let withLineNumbers = ''
    let count = 0
    withLineNumbers += `${count} `
    count++
    for (const char of code) {
      withLineNumbers += char
      if (char === '\n') {
        withLineNumbers += `${count} `
        count++
      }
    }
    return withLineNumbers
  }

  /**
   * Method for creating snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const withLineNumbers = this.addLineNumbers(req.body.code)
      const data = {
        title: req.body.title,
        user: req.session.username,
        code: withLineNumbers,
        language: req.body.language
      }
      const snippet = new Snippet({ ...data })
      await snippet.save()
      req.session.flash = { type: 'success', text: 'The snippet was saved successfully.' }
      res.redirect('./')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message || 'Something went wrong.' }
      next(error)
    }
  }

  /**
   * Method for updating specific snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { id } = req.params
      // Recreates the code with line numbers.
      let newCode = req.body.code.replace(/( ?\d+ )*/gm, '')
      newCode = this.addLineNumbers(newCode)
      await Snippet.findByIdAndUpdate(id, { title: req.body.title, code: newCode, language: req.body.language })
      req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      res.redirect('../')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message || 'Something went wrong.' }
      next(error)
    }
  }

  /**
   * Method for showing specific snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async show (req, res, next) {
    try {
      const { id } = req.params
      // TODO: Use map to select specific fields.
      const viewData = await Snippet.findById(id)
      res.render('snippets/show', { viewData, hljs })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Method for deleting snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const { id } = req.params
      await Snippet.findByIdAndDelete(id)
      req.session.flash = { type: 'danger', text: 'The snippet was deleted successfully.' }
      res.redirect('../')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message || 'Something went wrong.' }
      next(error)
    }
  }
}
