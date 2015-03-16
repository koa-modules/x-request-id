/*!
 * x-request-id
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

/**
 * Module dependences.
 */

var debug = require('debug')('koa:x-request-id')
var uuid = require('node-uuid').v4;

const HTTP_X_REQUEST_ID_HEADER = 'X-Request-Id';
const REGEXP = /\-/g;

/**
 * X-Request-Id:
 *
 * Generates a unique Request ID for every incoming HTTP request.
 * This unique ID is then passed to your application as an HTTP header called
 * `X-Request-Id`.
 *
 * @param {string} [key=HTTP_X_REQUEST_ID_HEADER]
 * @param {bool} [noHyphen=false]
 * @param {bool} [inject=false]
 * @api public
 */

module.exports = xRequestId;

function xRequestId(app, options) {
  options = options || {};
  var key = options.key || HTTP_X_REQUEST_ID_HEADER;
  var noHyphen = !!options.noHyphen;
  var inject = !!options.inject;

  if (inject) {
    Object.defineProperty(app.request, 'id', {
      get: function() {
        return this._id;
      },
      set: function(id) {
        this._id = id;
      }
    });
    Object.defineProperty(app.context, 'id', {
      get: function() {
        return this.request.id;
      }
    });
  }

  return function* xRequestId(next) {
    var id = this.id || this.query[key] || this.get(key) || uuid();
    if (noHyphen) id = id.replace(REGEXP, '');
    if (inject) this.request.id = id;
    this.set(key, id);
    debug('%s: %s', key, id);
    yield * next;
  }
}