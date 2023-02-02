import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import logger from 'morgan'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import session from 'express-session'
/**
 * Main application.
 */
try {
  await connectDB()
  const app = express()
  const dirName = dirname(fileURLToPath(import.meta.url))
  const baseURL = process.env.BASE_URL || '/'
  const PORT = process.env.PORT || 3000

  if (app.get('env') === 'development') {
    app.use(logger('dev'))
  }

  app.use(helmet())
  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", 'cdn.jsdelivr.net']
    }
  }))

  app.use(express.urlencoded({ extended: false }))

  app.set('view engine', 'ejs')
  app.set('views', join(dirName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(dirName, 'views', 'layouts', 'default'))

  app.use(express.static(join(dirName, '..', 'public')))

  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict'
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
  }

  app.use(session(sessionOptions))

  app.use((req, res, next) => {
    res.locals.baseURL = baseURL
    res.locals.isLoggedIn = req.session.isLoggedIn

    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    next()
  })

  app.use(baseURL, router)

  app.use(function (err, req, res, next) {
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(dirName, 'views', 'errors', '404.html'))
    }

    if (err.status === 403) {
      return res
        .status(403)
        .sendFile(join(dirName, 'views', 'errors', '403.html'))
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(dirName, 'views', 'errors', '500.html'))
    }

    res
      .status(err.status || 500)
      .render('errors/error', { error: err })
  })

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
