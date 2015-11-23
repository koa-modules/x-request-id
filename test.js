const Koa = require('koa')
const convert = require('koa-convert')
const mount = require('koa-mount')
const request = require('supertest')
const xRequestId = require('./')

const UUID_REG = /[0-9a-zA-Z\-]{36}/
const UUID_REG2 = /[0-9a-zA-Z]{32}/

describe('xRequestId', () => {
  it('should not touch the method by default', (done) => {
    var server = createServer()
    request(server.listen())
    .get('/')
    .expect('X-Request-Id', UUID_REG)
    .expect(200, done)
  })

  it('should return custom key `Request-Id`', (done) => {
    var server = createServer('Request-Id')
    request(server.listen())
    .get('/')
    .expect('Request-Id', UUID_REG)
    .expect(200, done)
  })

  it('should return no-hyphen uuid', (done) => {
    var server = createServer('Request-Id', true)
    request(server.listen())
    .get('/')
    .expect('Request-Id', UUID_REG2)
    .expect(200, done)
  })

  it('should be injected', (done) => {
    var server = createServer('Request-Id', true, true)
    request(server.listen())
    .get('/')
    .expect('Request-Id', UUID_REG2)
    .expect(UUID_REG2)
    .expect(200, done)
  })

  it('should be injected', (done) => {
    var server = createServer(null, true, true)
    request(server.listen())
    .get('/')
    .expect('X-Request-Id', UUID_REG2)
    .expect(200, done)
  })

  it('mount', (done) => {
    var a = createServer(null, true, true)
    var b = createServer(null, true, true)

    a.use((ctx, next) => {
      ctx.body = 'A x-request-id: ' + ctx.id
    })

    b.use((ctx, next) => {
      ctx.body = 'B x-request-id: ' + ctx.id
    })

    var app = createServer(null, true, true)

    app.use(convert(mount('/a', a)))
    app.use(convert(mount('/b', b)))

    request(app.listen())
    .get('/')
    .expect(200)
    .end((err) => {
      if (err) return done(err)

      request(app.listen())
      .get('/a')
      .expect('X-Request-Id', UUID_REG2)
      .end((err) => {
        if (err) return done(err)

        request(app.listen())
        .get('/b')
        .expect('X-Request-Id', UUID_REG2)
        .end(done)
      })
  })
  })
})

function createServer(key, noHyphen, inject) {
  const app = new Koa()
  app.use(xRequestId({
    key: key,
    noHyphen: noHyphen,
    inject: inject
  }, app))
  app.use((ctx, next) => {
    ctx.body = ctx.id || 'X-Request-Id'
  })
  return app
}
