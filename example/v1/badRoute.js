const { StandardError } = require('../../src/ketogenic')

const endpoint = '/badRoute'

function badRoute (req, res) {
  const error = new StandardError(501, {
    trace: 'data'
  }, 'Bad request')

  throw error
}

function handler (router) {
  router.route(endpoint)
    .get(badRoute)
}

module.exports = {
  handler,
  endpoint
}
