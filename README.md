# koa-x-request-id

> Generates a unique Request ID for every incoming HTTP request.
> This unique ID is then passed to your application as an HTTP header called `X-Request-Id`.

[![NPM version][npm-img]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![Dependency status][david-img]][david-url]
[![License][license-img]][license-url]

## Install

```sh
$ npm install --save koa-x-request-id
```

## Usage

### **=2.x**, working with `koa-v2`

```
app.use(xRequestId({ key, noHyphen, inject }, [app]))
```

```js
const Koa = require('koa')
const xRequestId = require('koa-x-request-id')
const app = new Koa()

// key defaults to `X-Request-Id`
// if `noHyphen = true`, generates 32 uuid, no hyphen `-`.
// if `inject = true`, `ctx.id = uuid`
app.use(xRequestId({key, noHyphen, inject}, app))
```

### **=1.x**

```
app.use(xRequestId(app, { key, noHyphen, inject }))
```

```js
var koa = require('koa')
var xRequestId = require('koa-x-request-id')
var app = koa()

// key defaults to `X-Request-Id`
// if `noHyphen = true`, generates 32 uuid, no hyphen `-`.
// if `inject = true`, `ctx.id = uuid`
app.use(xRequestId({key, noHyphen, inject}, app))
```

[npm-img]: https://img.shields.io/npm/v/koa-x-request-id.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-x-request-id
[travis-img]: https://img.shields.io/travis/koa-modules/x-request-id.svg?style=flat-square
[travis-url]: https://travis-ci.org/koa-modules/x-request-id
[coveralls-img]: https://img.shields.io/coveralls/koa-modules/x-request-id.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koa-modules/x-request-id?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/koa-modules/x-request-id.svg?style=flat-square
[david-url]: https://david-dm.org/koa-modules/x-request-id
[downloads-image]: https://img.shields.io/npm/dm/koa-x-request-id.svg?style=flat-square
