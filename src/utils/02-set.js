/**
 * * set
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * Allows the user to set their own data and functions. They can be accessed
 * * via unpack. Functions with the same name as a keto function will override
 * * the keto function, allowing for customization.
 */

const { inspect } = require('util')

function set (app) {
  const { extras, logger } = app.__KETO

  return function _set (key, value) {
    extras[key] = value
    logger(`Set extras.${key} to ${inspect(value)}`)
  }
}

module.exports.utils = set
