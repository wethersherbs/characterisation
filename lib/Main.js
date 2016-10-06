var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Automatic, general purpose characterisation.

import { composeN, constant, uncurryN } from 'wi-jit';
import { map, pair, sequence } from './Prelude';

import { unit } from './Control/Future';
import { fetch } from './Network';
import { createTwoFilesPatch } from 'diff';

// Diff two strings as expected vs actual.
// diff : String -> String -> String
const diff = uncurryN(createTwoFilesPatch)('expected', 'actual');

// Convert a request spec into a testing task.
// testify : (Response -> String) -> Request -> Future Error Test
const testify = format => request => request.map(composeN(pair(request), format));

// Run the request, and check that it matches the response.
const comparify = responsify => (_ref) => {
  var _ref2 = _slicedToArray(_ref, 2);

  let request = _ref2[0];
  let response = _ref2[1];
  return fetch(request).map(composeN(diff(response), responsify));
};

// Generate tests for this characterisation suite.
// generate : Future e a -> (Response -> String) -> [Request] -> Future Error [Test]
export const generate = fixturify => responsify => composeN(fixturify.chain, constant, sequence(unit), map(map(responsify), testify));

// Run the tests generated for this characterisation suite.
// test : Future e a -> (Response -> String) -> [Test] -> Future Error [Diff]
export const test = fixturify => responsify => composeN(fixturify.chain, constant, sequence(unit), map(map(responsify), comparify));

// Convert a Promise-returning thunk to a Future.
// toFuture : Promise e a -> Future e a
export const toFuture = promiser => unit(rej => res => promiser().then(res).catch(rej));