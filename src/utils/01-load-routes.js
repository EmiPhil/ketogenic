/**
 * * load-routes
 *
 * ? v-1.0.0-rc.1
 * RP: EmiPhil
 *
 * * Calls each route in a directory tree. Easier than importing a bunch of
 * * files. This should eventually be replaced by import * from index
 */

const { readdirSync, statSync } = require('fs')
const { join } = require('path')

function forEachRoute (path, func) {
  // * We can use sync safely because these functions are only called once when
  // * the server is started
  const files = readdirSync(path)
  files.forEach(func)
}

function loadRoutes (logger) {
  return function _loadRoutes ({
    root,
    dir = 'routes',
    mountPath,
    router,
    app
  }, ...args) {
    // * Default mountPath is the folder name
    if (!mountPath) {
      mountPath = `/${dir}`
    }

    const dirname = join(root, dir)
    logger(`loadRoutes mounting from ${dirname} to ${mountPath}`)
    // * Load each route
    let routes = []
    forEachRoute(dirname, function _loadRoute (file) {
      const filePath = join(dirname, file)
      // ! Skip directories - call loadRoutes in a subfile to load deep routes
      if (statSync(filePath).isDirectory()) return

      routes = routes.concat(require(filePath))
    })

    // * Apply the router to each route and concat their names
    let endpoints = ['/']
    const mountPathText = mountPath === '/' ? '' : mountPath
    routes.forEach(function _applyRoute (route) {
    // ! Route files must export the following:
    // ! skip - a flag to not load the route
    // ! endpoint - the name of the endpoint
    // ! handler - the function to apply the router to
      const { skip, endpoint, handler } = route
      if (skip) return

      // ! Mutate the router
      handler(router, ...args)
      endpoints = endpoints.concat(endpoint)
      logger(`loadRoutes mounted ${mountPathText}${endpoint}`)
    })

    // * Create an index for this route
    // ! Mutates the router
    router.route('/').all(function _index (req, res) {
      const { handleRes } = req.app.unpack(req)
      return handleRes(req, res).accept({
        paths: endpoints
      })
    })
    app.use(mountPath, router)
    logger(`loadRoutes mounted ${mountPath}`)
  }
}

module.exports.utils = loadRoutes
