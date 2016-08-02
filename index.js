'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.generate = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _ramda = require('ramda');

var _diff = require('diff');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } // Automatic, general purpose characterisation.

// Some clever function to work out the differences between expected
// and actual. Haven't actually worked out what this will do yet, but
// we're all very excited to find out.
var diff = function diff(before) {
  return function (after) {
    return (0, _diff.createTwoFilesPatch)('expected', 'actual', before, after);
  };
};

// Send a request to the app. We can't necessarily start a request
// before the last has totally completed, in case output is unbuffered.
// send :: Request -> Promise Response
var send = function send(_ref) {
  var url = _ref.url;

  var options = _objectWithoutProperties(_ref, ['url']);

  return (0, _nodeFetch2.default)(url, options).then(function (response) {
    return {
      headers: response.headers, status: response.status, json: response.json()
    };
  }).catch(console.log.bind(console));
};

// Response = { body :: String, headers :: [String], status :: Int }
// Request  = { url :: String, body :: String, headers :: [String] }
// Test     = [Request, Response]
// Diff     = [{ before :: [String], after :: [String], start :: Int
//              context :: { before :: [String], after :: [String] }]

// Generate tests for this characterisation suite.
// generate :: (* -> *) -> (Response -> String) -> [Request] -> [Test]
var generate = exports.generate = function generate(fixturify, responsify) {
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify();

  // For every request, make the call, do any output
  // processing, and then return the storable responses.
  return (0, _ramda.map)(function (r) {
    return (0, _ramda.composeP)(function (x) {
      return [r, x];
    }, responsify, send)(r);
  });
};

// Run the tests generated for this characterisation suite.
// test :: (* -> *) -> (Response -> String) -> [Test] -> [[Diff]]
var test = exports.test = function test(fixturify, responsify) {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify();

  // For each test, run the same processing on the response
  // and compare to the result generated earlier.
  return (0, _ramda.map)(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2);

    var req = _ref3[0];
    var res = _ref3[1];
    return (0, _ramda.composeP)(diff(res), responsify, send)(req);
  });
};
