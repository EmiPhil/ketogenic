/**
 * * chaos
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * Purposefully nuke requests
 */

function gamble () {
  // ? 1 in 5 chance of chaos
  // ? gamble will be one of [0, 1, 2, 3, 4]
  return Math.floor(Math.random() * Math.floor(5)) === 4
}

function chaos (req, res, next) {
  const {
    handleRes
  } = req.app.__KETO.utils

  if (gamble()) {
    return handleRes(req, res).reject('CHAOS!')
  }

  next()
}

function mountChaos (app) {
  app.use(chaos)
}

module.exports.utils = mountChaos
