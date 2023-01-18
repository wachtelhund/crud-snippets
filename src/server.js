import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import helmet from 'helmet'
import logger from 'morgan'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import methodOverride from 'method-override'

try {
  await connectDB()
  const app = express()
  const dirName = dirname(fileURLToPath(import.meta.url))
  const baseURL = process.env.BASE_URL || '/'
  const PORT = process.env.PORT || 3000

  app.use(logger('dev'))
  app.use(helmet())
  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", 'cdn.jsdelivr.net']
    }
  }))
  app.use(methodOverride('_method'))

  app.use(express.urlencoded({ extended: false }))

  app.set('view engine', 'ejs')
  app.set('views', join(dirName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(dirName, 'views', 'layouts', 'default'))

  app.use(express.static(join(dirName, '..', 'public')))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Pass the base URL to the views.
    res.locals.baseURL = baseURL
    next()
  })

  app.use('/', router)

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
