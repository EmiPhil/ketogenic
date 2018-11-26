/**
 * * mount-utils
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * These are the ketogenic-specific utils that help with server creation and
 * * handling.
 */

const handleRes = require('./00-handle-res').utils
const unpack = require('./03-unpack').utils
const set = require('./02-set').utils
const loadRoutes = require('./01-load-routes').utils
const mountChaos = require('./99-chaos').utils

function mountUtils (app, chaos = false) {
  const { logger } = app.__KETO

  logger('Mounting ketogenic utils')

  app.__KETO.utils = { logger }

  app.__KETO.utils.handleRes = handleRes
  logger('Mounted handleRes')

  app.__KETO.extras = {}
  app.__KETO.utils.set = set(app)
  logger('Mounted set')

  app.__KETO.utils.loadRoutes = loadRoutes(logger)
  logger('Mounted loadRoutes')

  // ! unpack is the only keto method that gets mounted outside of the __KETO
  // ! objects (for ease of use)
  app.unpack = unpack
  logger('Mounted unpack to the root of app')

  // * Only run chaos in development and when explicitly requested.
  // * Note that chaos behaves more like a middleware than a true utility.
  if (chaos && process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
    mountChaos(app)
    logger('WARNING: Mounted chaos. Your requests WILL FAIL 20% of the time.')
  }
}

module.exports = mountUtils
