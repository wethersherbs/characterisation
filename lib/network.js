"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = void 0;

var _http = require("http");

var _url = require("url");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fetch = function fetch(url, options) {
  return Promise(function (res, rej) {
    return (0, _http.request)(_objectSpread({}, (0, _url.parse)(url), {}, options), function (res) {
      var body = [];
      var status = res.statusCode;
      var headers = res.headers;
      res.on('data', body.push.bind(body));
      res.on('end', function (_) {
        return res({
          status: status,
          headers: headers,
          body: body
        });
      });
      res.on('error', rej);
    });
  });
};

exports.fetch = fetch;