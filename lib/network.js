var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { request } from 'http';
import { parse } from 'url';

// Fetch a resource from a server using http.request.
// @TODO Make friendly with https? Or is there no point?
// fetch :: Request -> Promise Response Error
export const fetch = (url, options) => Promise((res, rej) => request(_extends({}, parse(url), options), res => {
  const body = [];
  const status = res.statusCode;
  const headers = res.headers;

  res.on('data', body.push.bind(body));
  res.on('end', _ => res({ status, headers, body }));
  res.on('error', rej);
}));