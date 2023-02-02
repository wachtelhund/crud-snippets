import { Snippet } from '../models/snippet.js'
import { User } from '../models/user.js'
/**
 * Module for the SnippetsController.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

/**
 * Snippets controller.
 */
export class UsersController {
  /**
   * Render login form.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {}
      viewData.username = req.session.username
      res.render('users/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete user and all snippets.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await User.findOneAndDelete({ username: req.session.username })
      await Snippet.deleteMany({ user: req.session.username })
      req.session.destroy(() => {
        res.redirect('../snippets')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Something went wrong deleting your account.' }
      next(error)
    }
  }

  /**
   * Log out user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      req.session.destroy(() => {
        res.redirect('../')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Something went wrong logging out your account.' }
      next(error)
    }
  }

  /**
   * Render login page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      res.render('users/login')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Check authentication and log in user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async postLogin (req, res, next) {
    try {
      const authenticatedUser = await User.isCorrectPassword(req.body.username, req.body.password)
      req.session.regenerate(async () => {
        req.session.username = req.body.username
        req.session.flash = { type: 'success', text: 'You are now logged in. Welcome ' + authenticatedUser.username + '!' }
        req.session.isLoggedIn = true
        res.redirect('../snippets')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Wrong username or password.' }
      res.redirect('./login')
    }
  }

  /**
   * Render register page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      res.render('users/register')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message || 'Something went wrong.' }
      next(error)
    }
  }

  /**
   * Check validity of user input and register user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async postRegister (req, res, next) {
    req.session.regenerate(async () => {
      try {
        if (req.body.password.length < User.schema.paths.password.options.minlength[0]) {
          throw new Error(User.schema.paths.password.options.minlength[1])
        }
        const user = new User({ username: req.body.username, password: req.body.password })
        await user.save()
        req.session.isLoggedIn = true
        req.session.username = user.username
        req.session.flash = { type: 'success', text: 'You are now registered. Welcome ' + req.body.username.trim() + '!' }
        res.redirect('../snippets')
      } catch (error) {
        if (error.code === 11000) {
          error.message = `User "${error.keyValue.username}" already exists.`
        }
        req.session.flash = { type: 'danger', text: error.message || 'Something went wrong.' }
        res.redirect('./register')
      }
    })
  }
}
