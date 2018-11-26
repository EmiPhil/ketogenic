/**
 * * Ketogenic express middleware
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * This middleware is primarily meant as a way to reduce copy-pasting in the
 * * projects I work on. There are a few middlewares that I tend to apply to
 * * api servers with the same configurations, and Ketogenic does it
 * * for me automatically. It is highly opinionated, but may be useful for
 * * others.
 */

const { yellow } = require('chalk')

const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')

const mountMiddleware = require('./middleware/mount-middleware')
const mountUtils = require('./utils/mount-utils')

const { StandardError, processStandardError } = require('./StandardError')

function Ketogenic ({
  logger = console,
  verbose = true,
  chaos = false
} = {}) {
  // * Ketogenic will automatically do verbose logging if supported and enabled
  verbose = typeof logger.verbose === 'function' && verbose
  function log (message = '', header = yellow('KETO')) {
    // * Check if verbose logging is available and, if it is, pass the message
    // * directly to the supplied logger.
    // ? Recommended logger: winston
    // @ https://www.npmjs.com/package/winston
    verbose && logger.verbose(`${header} || ${message}`)
  }

  // ! The Ketogenic middleware requires that you pass the entire app instead
  // ! of simply calling app.use(Ketogenic({})). This is because Ketogenic
  // ! applies many middleware to the application
  function ketogenic (app) {
    // * Check that we are given an express-like app, and throw if we aren't
    if (!app || typeof app.use !== 'function') {
      const error = Error('Invalid server given. Did you pass the whole server object (for express, the app)?')
      error.trace = { app }
      throw error
    }

    // * Add our signature to the application. We will use this object for
    // * mounting any extra things we need (the format helps to avoid conflicts)
    const __KETO = {
      isKeto: true,
      version: 'v1.0.0',
      logger: log
    }

    app.__KETO = __KETO

    log('Mounting 3rd party middlewares to the webserver:')

    // * Add urlencoded parsing with qs support (extended: true)
    // @ https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions
    app.use(bodyParser.urlencoded({
      extended: true
    }))
    log('Mounted body-parser.urlencoded')

    // * Add json support
    // @ https://www.npmjs.com/package/body-parser#bodyparserjsonoptions
    app.use(bodyParser.json())
    log('Mounted body-parser.json')

    // * Add compression support by default. Do not compress if given the
    // * request header 'x-no-compression'
    // @ https://www.npmjs.com/package/compression#filter-1
    function shouldCompress (req, res) {
      // ? This function is pulled from the website above.
      if (req.headers['x-no-compression']) {
        // * don't compress responses with this request header
        return false
      }
      // * fallback to standard filter function
      return compression.filter(req, res)
    }
    app.use(compression({ filter: shouldCompress }))
    log('Mounted compression')

    // * Add helmet for securing the express application.
    // @ https://www.npmjs.com/package/helmet
    app.use(helmet())
    log('Mounted helmet')
    // * By default, helmet does not activate all modules, so we also mount the
    // * raw helmet package to the application in case a user wants to add them
    app.__KETO.helmet = helmet
    log('You can access additional helmet functions via app.__KETO.helmet')

    // * Add our ketogenic enhancements
    mountMiddleware(app)
    mountUtils(app, chaos)

    // * Return the new app. This isn't necessary to use because ketogenic
    // * mutates app
    return app
  }

  // * Add 'metadata' to the ketogenic function
  return Object.assign(ketogenic, {
    constructor: Ketogenic
  })
}

// * Export the StandardError
Ketogenic.StandardError = StandardError
Ketogenic.processStandardError = processStandardError

module.exports = Ketogenic
