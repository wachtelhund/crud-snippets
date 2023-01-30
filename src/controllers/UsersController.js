import session from "express-session"
import { User } from '../models/user.js'

export class UsersController {
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
      req.session.regenerate(() => {
        req.session.username = req.body.username
      })
      req.session.flash = { type: 'success', text: 'You are now logged in. Welcome ' + authenticatedUser.username + '!' }
      res.redirect('../snippets')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Wrong username or password.' }
      res.redirect('../users/login')
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
    try {
      const user = new User({ username: req.body.username, password: req.body.password })
      await user.save()
      req.session.flash = { type: 'success', text: 'You are now registered. Welcome ' + req.body.username.trim() + '!' }
      res.redirect('../snippets')
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'User already exists' }
      res.redirect('./register')
    }
  }
}
