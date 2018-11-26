/**
 * * request-id
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 * * Request ids are 4-character prefixes that help when tracing logs for a
 * * particular request. There isn't much need for them to be universally
 * * unique - just unique within a small slice of time
 */

const nanoid = require('nanoid')

function generateRequestId () {
  return nanoid(4)
}

function mountIdToReq (req, _, next) {
  req.__KETO.id = generateRequestId()
  next()
}

module.exports.middleware = mountIdToReq
