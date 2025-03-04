import express from 'express'

import * as routes from './routes'
import { requestLogger, errorLogger } from './lib/utils/logger'

export const BUID = 'bearerUid' // TODO - What is this for?
export const PORT = process.env.PORT || 8080

const app = express()

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('trust proxy', 1)
app.use('/assets', express.static('./views/assets'))

/**
 * Request log
 */
app.use(requestLogger)

/**
 * Project homepage
 */

app.get('/', routes.home)

/**
 * API endpoints
 */

app.use('/api', routes.api)

/**
 * Authentication endpoints
 */

app.use('/auth', routes.auth)

/**
 * Dashboard
 */

app.use('/dashboard', routes.dashboard)

/**
 * Proxy feature
 */

app.use('/proxy', routes.proxy)

/**
 * Legacy endpoints
 *
 * Pizzly is a fork of a previous codebase made by Bearer.sh engineering team.
 * To help the migration of Bearer's users, we keep here some legacy endpoints.
 * It's very likely that these endpoints will be removed by the end of 2020,
 * so please do not rely on these endpoints anymore.
 */

app.use('/v2/auth', routes.legacy.auth)
app.use('/apis', routes.legacy.apis)
app.use('/api/v4/functions', routes.legacy.proxy)

/**
 * Error handling
 */

app.use(errorLogger)
app.use((req, res, next) => {
  res.status(404).render('404')
})

app.use((err, req, res, next) => {
  if (err.status && err.status === 401) {
    res.status(401).render('401')
  } else {
    console.error(err)
    res.status(500).render('500')
  }
})

/**
 * Starting up the server
 */

app.listen(PORT, () => {
  console.log('Pizzly listening on port', PORT)
  if (PORT === 8080) {
    console.log('http://localhost:8080')
  }
})
