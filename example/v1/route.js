const endpoint = '/route'

function route (req, res) {
  const {
    logger,
    handleRes,
    myExtra,
    data
  } = req.app.unpack(req)

  logger.verbose('Hello!')
  myExtra()

  return handleRes(req, res).accept({
    it: 'works!',
    msg: 'routes should fail 20% of the time because of chaos',
    data
  })
}

function handler (router) {
  router.route(endpoint)
    .get(route)
}

module.exports = {
  handler,
  endpoint
}
