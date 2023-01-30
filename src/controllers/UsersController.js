import session from "express-session"

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
      req.session.flash = { type: 'success', text: 'You are now logged in. Welcome ' + req.body.username.trim() + '!' }
      res.redirect('../snippets')
    } catch (error) {
      next(error)
    }
  }

  async register (req, res, next) {
    try {
      res.render('users/register')
    } catch (error) {
      next(error)
    }
  }

  async postRegister (req, res, next) {
    try {
      req.session.flash = { type: 'success', text: 'You are now registered. Welcome ' + req.body.username.trim() + '!' }
      res.redirect('../snippets')
    } catch (error) {
      console.log(error);
    }
  }
}
