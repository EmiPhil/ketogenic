/**
 * * request-timer
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 * * Start a timer on each request.
 */
const prettyTime = require('pretty-time')

function startTimer () {
  // @ https://nodejs.org/docs/latest-v10.x/api/process.html#process_process_hrtime_time
  return process.hrtime()
}

// * endTimer is curried so that we can immediately mount the start time to the
// * function. Future invokers can just call endTimer()
function endTimer (start, logger) {
  return function _end () {
    const elapsed = process.hrtime(start)
    const timeString = prettyTime(elapsed)
    logger(`Resolved in ${timeString}`)
    return { elapsed, timeString }
  }
}

function mountTimer (req, _, next) {
  const { logger } = req.__KETO
  // * Start a timer for the request
  const start = startTimer()

  // * We also give the endTimer function to the app. We do not handle calling
  // * the endTimer function here! See the handleRes function which does call
  // * it. We do curry it with the start time, however, so a future callee does
  // * not need to use the req.__KETO.start.
  req.__KETO.endTimer = endTimer(start, logger)
  next()
}

module.exports.middleware = mountTimer
