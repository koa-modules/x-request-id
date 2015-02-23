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

function xRequestId(key, noHyphen, inject) {
  key = key || HTTP_X_REQUEST_ID_HEADER;
  noHyphen = !!noHyphen;
  inject = !!inject;

  return function* xRequestId(next) {
    requestId(this, key, noHyphen, inject);
    yield* next;
  }
}

function requestId(ctx, key, noHyphen, inject) {
  var id = ctx.request.query[key]
    || ctx.response.get(key)
    || uuid();
  if (noHyphen) id = id.replace(REGEXP, '');
  if (inject) ctx[key.toLowerCase().replace(REGEXP, '_')] = id;
  ctx.set(key, id);
  debug('%s: %s', key, id);
}