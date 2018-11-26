/**
 * * unpack
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * Unpacks keto stuff into a unified object for usage.
 */

function unpack (req) {
  const {
    utils,
    // * extras is a user-writeable object that allows overwriting Keto funcs
    // * without losing access to the unpack utility.
    extras
  } = req.app.__KETO

  const {
    data,
    logger
  } = req.__KETO

  return Object.assign({}, utils, { data }, logger, extras)
}

module.exports.utils = unpack
