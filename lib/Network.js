var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { request } from 'http';
import { parse } from 'url';

import { Future } from './Control/Future';

// Fetch a resource from a server using http.request.
// fetch : Request -> Future Error Response
export const fetch = (_ref) => {
  let url = _ref.url;

  let options = _objectWithoutProperties(_ref, ['url']);

  return Future(no => yes => request(_extends({}, parse(url), options), res => {
    const data = [];

    res.on('data', x => data.push(x));
    res.on('error', no);
    res.on('end', () => yes({
      status: res.statusCode,
      headers: res.headers,
      body: data.join('')
    }));
  }));
};