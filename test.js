var koa = require('koa');
var request = require('supertest');
var xRequestId = require('./')

describe('xRequestId', function() {
  it('should not touch the method by default', function(done) {
    var server = createServer()
    request(server)
      .get('/')
      .expect('X-Request-Id', /[0-9a-zA-Z\-]{36}/)
      .expect(200, done)
  })

  it('should return custom key `Request-Id`', function(done) {
    var server = createServer('Request-Id')
    request(server)
      .get('/')
      .expect('Request-Id', /[0-9a-zA-Z\-]{36}/)
      .expect(200, done)
  })

  it('should return no-hyphen uuid', function(done) {
    var server = createServer('Request-Id', true)
    request(server)
      .get('/')
      .expect('Request-Id', /[0-9a-zA-Z]{32}/)
      .expect(200, done)
  })

  it('should be injected', function(done) {
    var server = createServer('Request-Id', true, true)
    request(server)
      .get('/')
      .expect('Request-Id', /[0-9a-zA-Z]{32}/)
      .expect(/[0-9a-zA-Z]{32}/)
      .expect(200, done)
  })

  it('should be injected', function(done) {
    var server = createServer(null, true, true)
    request(server)
      .get('/')
      .expect('X-Request-Id', /[0-9a-zA-Z]{32}/)
      .expect(200, done)
  })
});

function createServer(key, noHyphen, inject) {
  var app = koa();
  app.use(xRequestId(key, noHyphen, inject));
  app.use(function*() {
    this.body = this.id || 'X-Request-Id';
  });
  return app.listen();
}