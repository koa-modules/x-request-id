var koa = require('koa');
var mount = require('koa-mount');
var request = require('supertest');
var xRequestId = require('./')

describe('xRequestId', function() {
  it('should not touch the method by default', function(done) {
    var server = createServer()
    request(server.listen())
      .get('/')
      .expect('X-Request-Id', /[0-9a-zA-Z\-]{36}/)
      .expect(200, done)
  })

  it('should return custom key `Request-Id`', function(done) {
    var server = createServer('Request-Id')
    request(server.listen())
      .get('/')
      .expect('Request-Id', /[0-9a-zA-Z\-]{36}/)
      .expect(200, done)
  })

  it('should return no-hyphen uuid', function(done) {
    var server = createServer('Request-Id', true)
    request(server.listen())
      .get('/')
      .expect('Request-Id', /[0-9a-zA-Z]{32}/)
      .expect(200, done)
  })

  it('should be injected', function(done) {
    var server = createServer('Request-Id', true, true)
    request(server.listen())
      .get('/')
      .expect('Request-Id', /[0-9a-zA-Z]{32}/)
      .expect(/[0-9a-zA-Z]{32}/)
      .expect(200, done)
  })

  it('should be injected', function(done) {
    var server = createServer(null, true, true)
    request(server.listen())
      .get('/')
      .expect('X-Request-Id', /[0-9a-zA-Z]{32}/)
      .expect(200, done)
  })

  it('mount', function(done) {
    var a = createServer(null, true, true);
    var b = createServer(null, true, true);

    a.use(function*(next) {
      this.body = 'A x-request-id: ' + this.id;
    });

    b.use(function*(next) {
      this.body = 'B x-request-id: ' + this.id;
    });

    var app = createServer(null, true, true);

    app.use(mount('/a', a));
    app.use(mount('/b', b));

    request(app.listen())
      .get('/')
      .expect(200)
      .end(function(err) {
        if (err) return done(err);

        request(app.listen())
          .get('/a')
          .expect('X-Request-Id', /[0-9a-zA-Z]{32}/)
          .end(function(err) {
            if (err) return done(err);

            request(app.listen())
              .get('/b')
              .expect('X-Request-Id', /[0-9a-zA-Z]{32}/)
              .end(done);
          });
      });
  });
});

function createServer(key, noHyphen, inject) {
  var app = koa();
  app.use(xRequestId(app, {
    key: key,
    noHyphen: noHyphen,
    inject: inject
  }));
  app.use(function*(next) {
    yield next;
    this.body = this.id || 'X-Request-Id';
  });
  return app;
}