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
      // TODO: Use map to select specific fields.
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

  async editForm (req, res, next) {
    try {
      const { id } = req.params
      const viewData = await Snippet.findById(id)
      res.render('snippets/edit', { viewData })
    } catch (error) {
      next(error)
    }
  }

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

  async create (req, res, next) {
    try {
      //let withLineNumbers = ''
      //let count = 0
      //withLineNumbers += `${count} `
      //count++
      //for (const char of req.body.code) {
        //withLineNumbers += char
        //if (char === '\n') {
          //withLineNumbers += `${count} `
          //count++
        //}
      //}
      const withLineNumbers = this.addLineNumbers(req.body.code)
      const data = {
        title: req.body.title,
        user: 'Testuser',
        code: withLineNumbers,
        language: req.body.language
      }
      const snippet = new Snippet({ ...data })
      await snippet.save()
      req.session.flash = { type: 'success', text: 'The snippet was saved successfully.' }
      res.redirect('./')
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      const { id } = req.params
      let newCode = req.body.code.replace(/[\d+ ]*/gm, '')
      newCode = this.addLineNumbers(newCode)
      await Snippet.findByIdAndUpdate(id, { title: req.body.title, code: newCode, language: req.body.language })
      req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      res.redirect('../')
    } catch (error) {
      next(error)
    }
  }

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

  async delete(req, res, next) {
    try {
      const { id } = req.params
      await Snippet.findByIdAndDelete(id)
      req.session.flash = { type: 'danger', text: 'The snippet was deleted successfully.' }
      res.redirect('../')
    } catch (error) {
      next(error)
    }
  }
}
