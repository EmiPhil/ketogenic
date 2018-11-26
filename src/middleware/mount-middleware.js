/**
 * * mount-middleware
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * These are the ketogenic-specific middlewares that I like to use on all of
 * * my servers. This file mounts them in the order of their file prefixes.
 */

const requestId = require('./00-request-id').middleware
const requestLog = require('./01-request-log').middleware
const requestTimer = require('./02-request-timer').middleware
const unifyData = require('./03-unify-data').middleware

function mountMiddleware (app) {
  const { logger } = app.__KETO

  logger('Mounting ketogenic middleware')

  // * Add a __KETO object to each request for middleware usage
  app.use((req, _, next) => {
    req.__KETO = {
      isKeto: true,
      version: 'v1.0.0'
    }
    next()
  })

  app.use(requestId)
  logger('Mounted request-id')

  app.use(requestLog)
  logger('Mounted request-log')

  app.use(requestTimer)
  logger('Mounted request-timer')

  app.use(unifyData)
  logger('Mounted unify-data')
}

module.exports = mountMiddleware
