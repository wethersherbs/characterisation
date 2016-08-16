function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

// Automatic, general purpose characterisation.

import { fetch as send } from './network';
import { parse } from 'url';

import { createTwoFilesPatch as diff } from 'diff';

// Carry out a formatted request.
// fetch :: (Response -> ) -> Request -> Format
const fetch = responsify => (() => {
  var _ref = _asyncToGenerator(function* (request) {
    const { url, ...options } = request;

    return responsify((yield send(url, options)));
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

// Response     = { body :: String, headers :: [String], status :: Int }
// Responsified = String
// Request      = { url :: String, body :: String, headers :: [String] }
// Test         = (Request, String)
// Diff         = String

// Generate tests for this characterisation suite.
// generate :: (* -> *) -> (Response -> Responsified) -> [Request] -> [Test]
export const generate = (fixturify, responsify = x => x.body) => {
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify();

  // Produce the promises of generated tests.
  // testify :: [Request] -> Promise [Test] Error
  return map((() => {
    var _ref2 = _asyncToGenerator(function* (request) {
      const { url, ...options } = request;

      const response = responsify((yield send(url, options)));

      return [request, response];
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  })());
};

// Run the tests generated for this characterisation suite.
// test :: (-> *) -> (Response -> Responsified) -> [Test] -> [Diff]
export const test = (fixturify, responsify) => {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify();

  // For each test, run the same processing on the response
  // and compare to the result generated earlier.
  return map((() => {
    var _ref3 = _asyncToGenerator(function* ([request, expected]) {
      const { url, ...options } = request;

      const actual = responsify((yield send(url, options)));
      return diff('expected', 'actual', expected, actual);
    });

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  })());
};