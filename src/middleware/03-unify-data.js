/**
 * * unify-data
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 * * Bring all data into one spot regardless of the HTTP method
 */

function unifyData (req, _, next) {
  const {
    query,
    body
  } = req

  // ! We give query a higher weight than body
  req.__KETO.data = Object.assign({}, body, query)
  next()
}

module.exports.middleware = unifyData
