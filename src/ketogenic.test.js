const test = require('ava')
const Ketogenic = require('./ketogenic')

// * Basic tests
test('~', t => t.truthy(true))

test('ketogenic exports a function', t => {
  t.truthy(typeof Ketogenic === 'function')
})

test('Ketogenic is named "Ketogenic"', t => {
  t.truthy(Ketogenic.name === 'Ketogenic')
})

test('Ketogenic() returns another function', t => {
  t.truthy(typeof Ketogenic() === 'function')
})

test('Ketogenic() is named "ketogenic"', t => {
  t.truthy(Ketogenic().name === 'ketogenic')
})

test('Ketogenic().constructor returns Ketogenic', t => {
  t.deepEqual(Ketogenic().constructor, Ketogenic)
})

// * Functionality
const app = () => ({ use: () => {} })
const logger = (pass) => ({ verbose: () => { pass.ok = true } })

test('ketogenic() throws an error if not given an app', t => {
  try {
    Ketogenic()()
    t.fail('ketogenic did not throw')
  } catch (error) {
    t.truthy(error.constructor === Error)
  }
})

test('ketogenic(app) works', t => {
  Ketogenic()(app())
  t.pass()
})

test('ketogenic(app) returns an app with the __KETO object', t => {
  t.truthy(Ketogenic()(app()).__KETO.isKeto)
})

test('ketogenic(app) mutates app', t => {
  const keto = app()
  Ketogenic()(keto)
  t.truthy(keto.__KETO.isKeto)
})

// * Functionality.logger
test('Ketogenic can be given a custom logger', t => {
  let pass = { ok: false }
  Ketogenic({ logger: logger(pass) })(app())
  t.truthy(pass.ok)
})

test('Ketogenic will not log is verbose is set to false', t => {
  let pass = { ok: false }
  Ketogenic({ logger: logger(pass), verbose: false })(app())
  t.truthy(!pass.ok)
})
