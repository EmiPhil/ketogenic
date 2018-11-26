const express = require('express')
const Keto = require('../src/ketogenic')

console.verbose = console.info

const app = express()
const keto = Keto({
  logger: console,
  verbose: true,
  chaos: true
})

const {
  __KETO: { utils: { loadRoutes, set } }
} = keto(app)

set('myExtra', function () {
  console.log('Hello from inside keto!')
})

set('logger', console)

loadRoutes({
  root: __dirname,
  dir: 'v1',
  mountPath: '/',
  router: express.Router(),
  app
})

app.use(Keto.processStandardError)

app.listen(8080, function () {
  console.verbose(`Listening on port 8080`)
})
