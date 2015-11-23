'use strict'

/*!
 * x-request-id
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependences.
 */

const assert = require('assert')
const debug = require('debug')('koa:x-request-id')
const uuid = require('node-uuid').v4

const HTTP_X_REQUEST_ID_HEADER = 'X-Request-Id'

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

module.exports = xRequestId

function xRequestId(options, app) {
  options = options || {}
  const key = options.key || HTTP_X_REQUEST_ID_HEADER
  const noHyphen = !!options.noHyphen
  const inject = !!options.inject

  if (inject) {
    if (!app) throw new TypeError('`app` must be required!');

    Object.defineProperty(app.request, 'id', {
      get: function() {
        return this._id
      },
      set: function(id) {
        this._id = id
      }
    })
    Object.defineProperty(app.context, 'id', {
      get: function() {
        return this.request.id
      }
    })
  }

  return (ctx, next) => {
    var id = ctx.id || ctx.query[key] || ctx.get(key) || uuid()
    if (noHyphen) id = id.replace(/\-/g, '')
    if (inject) ctx.request.id = id
    ctx.set(key, id)
    debug('%s: %s', key, id)
    return next()
  }
}
