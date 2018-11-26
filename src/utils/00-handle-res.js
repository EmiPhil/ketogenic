/**
 * * handle-res
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * Sends responses in a consistent way.
 */
const { inspect } = require('util')

function handleRes (req, res) {
  // * Expects req.app to be keto-friendly
  const {
    logger,
    endTimer
  } = req.__KETO

  // * Do not send a response if we have already responded
  const proceed = () => {
    if (res.headersSent) {
      logger('Tried to send a response after we have already responded.')
      return false
    }
    return true
  }
  return {
    // * Users will mostly want to .accept or .reject requests, but other funcs
    // * are provided for convenience.
    accept (body) {
      body.ok = true
      body.took = endTimer().timeString
      proceed() && res.json(body)
    },
    acceptHtml (html) {
      endTimer()
      proceed() && res.send(html)
    },
    // * On failure, send a body with ok: false and related messages / traces
    reject (message = 'Unknown server error.', status = 500, trace = {}) {
      const body = {
        ok: false,
        took: endTimer().timeString,
        message,
        status,
        trace
      }
      logger(`Rejected [${status}]: ${inspect(body)}`)
      proceed() && res.status(status).json(body)
    }
  }
}

module.exports.utils = handleRes
