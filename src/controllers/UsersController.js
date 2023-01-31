import session from "express-session"
import { Snippet } from "../models/snippet.js"
import { User } from '../models/user.js'

export class UsersController {
  async index (req, res, next) {
    try {
      const viewData = {}
      viewData.username = req.session.username
      res.render('users/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      await User.findOneAndDelete({ username: req.session.username })
      await Snippet.deleteMany({ user: req.session.username })
      req.session.destroy(() => {
        req.session.flash = { type: 'success', text: 'Your account was removed.' }
        res.redirect('../snippets')
      })
    } catch (error) {
      next(error)
    }
  }

  async logout (req, res, next) {
    try {
      req.session.destroy(() => {
        res.redirect('../')
      })
    } catch (error) {
      next(error)
    }
  }

  async login (req, res, next) {
    try {
      res.render('users/login')
    } catch (error) {
      next(error)
    }
  }

  async postLogin (req, res, next) {
    try {
      const authenticatedUser = await User.isCorrectPassword(req.body.username, req.body.password)
      req.session.regenerate(async () => {
        req.session.username = req.body.username
        req.session.flash = { type: 'success', text: 'You are now logged in. Welcome ' + authenticatedUser.username + '!' }
        res.redirect('../snippets')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Wrong username or password.' }
      res.redirect('./login')
    }
  }

  async register (req, res, next) {
    try {
      res.render('users/register')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message || 'Something went wrong.' }
      next(error)
    }
  }

  async postRegister (req, res, next) {
    req.session.regenerate(async () => {
      try {
        if (req.body.password.length < User.schema.paths.password.options.minlength[0]) {
          throw new Error(User.schema.paths.password.options.minlength[1])
        }
        const user = new User({ username: req.body.username, password: req.body.password })
        await user.save()
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
