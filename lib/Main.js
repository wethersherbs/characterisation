var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Automatic, general purpose characterisation.

import { composeN } from 'wi-jit';
import { pair } from './Prelude';

import { fetch as send } from './Network';
import { unit as Future } from './Control/Future';
import { createTwoFilesPatch as diff } from 'diff';

// Create an AJAX task for a test.
// fetch : (Response -> String) -> Request -> Future Error String
const fetch = (_ref) => {
  let url = _ref.url;

  let options = _objectWithoutProperties(_ref, ['url']);

  return send(url, options);
};

// Convert a request spec into a testing task.
// testify : (Response -> String) -> Request -> Future Error Test
const testify = format => request => request.map(composeN(pair(request), format));

// Run the request, and check that it matches the response.
const comparify = responsify => (_ref2) => {
  var _ref3 = _slicedToArray(_ref2, 2);

  let request = _ref3[0];
  let response = _ref3[1];
  return fetch(req).map(composeN(diff(res), format));
};

// Generate tests for this characterisation suite.
// generate : Future e a -> (Response -> String) -> [Request] -> Future Error [Test]
export const generate = fixturify => responsify => composeN(fixturify.bind, sequence(Future), map(map(responsify), testify));

// Run the tests generated for this characterisation suite.
// test : Future e a -> (Response -> String) -> [Test] -> Future Error [Diff]
export const test = fixturify => responsify => composeN(fixturify.bind, sequence(Future), map(map(responsify), comparify));

// Convert a Promise-returning thunk to a Future.
// toFuture : Promise e a -> Future e a
export const toFuture = promiser => Future(flip(res => promiser().then(res).catch));