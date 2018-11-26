/**
 * * request-log
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 * * Log each request for tracing. Also append a message header, and override
 * * the __KETO logger to use it automatically.
 * ! request-id must have already been applied for this function to work!
 */

const {
  yellow,
  red,
  magenta
} = require('chalk')

function log (req, _, next) {
  const {
    app: {
      __KETO: { logger }
    },
    __KETO: { id },
    ip,
    method,
    originalUrl
  } = req

  const header = `${yellow(id)} [${red(method)}] (${ip}) @ ${magenta(originalUrl)}`
  logger('Initiated', header)

  req.app.__KETO.messageHeader = header
  req.__KETO.logger = (message = '') => logger(message, header)

  next()
}

module.exports.middleware = log
