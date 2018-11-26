/**
 * * Ketogenic StandardError
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * The StandardError class helps keep errors consistent across the endpoints.
 * * Return an error object with props:
 * *   message - Description of the error
 * *   status  - Http status code
 * *   trace   - JSON object with more details
 */

// * Class function initially taken from:
// @ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types

const { inspect } = require('util')

class StandardError extends Error {
  constructor (status = 500, trace = {}, ...params) {
    // * Pass remaining arguments (including vendor specific ones) to parent
    // * constructor
    super(...params)

    // * Maintains proper stack trace for where our error was thrown (only
    // * available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StandardError)
    }

    // * Custom debugging information
    this.status = status
    this.trace = trace
    this.keto = true
  }
}

function processStandardError (error, req, res, next) {
  // * Check that this is a standard error
  if (!error.keto) {
    // * ...and continue if it isn't
    return next(error)
  }

  const { handleRes } = req.app.unpack(req)

  const {
    message,
    status,
    trace
  } = error

  return handleRes(req, res).reject(message, status, trace)
}

module.exports = {
  StandardError,
  processStandardError
}
