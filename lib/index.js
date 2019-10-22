"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.generate = void 0;

var _network = require("./network");

var _url = require("url");

var _diff = require("diff");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var map = function map(xs) {
  return function (f) {
    return xs.map(f);
  };
}; // Carry out a formatted request.
// fetch :: (Response -> ) -> Request -> Format


var fetch = function fetch(responsify) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(request) {
        var url, options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = request.url, options = _objectWithoutProperties(request, ["url"]);
                _context.t0 = responsify;
                _context.next = 4;
                return (0, _network.fetch)(url, options);

              case 4:
                _context.t1 = _context.sent;
                return _context.abrupt("return", (0, _context.t0)(_context.t1));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}; // Response     = { body :: String, headers :: [String], status :: Int }
// Responsified = String
// Request      = { url :: String, body :: String, headers :: [String] }
// Test         = (Request, String)
// Diff         = String
// Generate tests for this characterisation suite.
// generate :: (* -> *) -> (Response -> Responsified) -> [Request] -> [Test]


var generate = function generate(fixturify) {
  var responsify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (x) {
    return x.body;
  };
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify(); // Produce the promises of generated tests.
  // testify :: [Request] -> Promise [Test] Error

  return map(
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(request) {
      var url, options, response;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = request.url, options = _objectWithoutProperties(request, ["url"]);
              _context2.t0 = responsify;
              _context2.next = 4;
              return (0, _network.fetch)(url, options);

            case 4:
              _context2.t1 = _context2.sent;
              response = (0, _context2.t0)(_context2.t1);
              return _context2.abrupt("return", [request, response]);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
}; // Run the tests generated for this characterisation suite.
// test :: (-> *) -> (Response -> Responsified) -> [Test] -> [Diff]


exports.generate = generate;

var test = function test(fixturify, responsify) {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify(); // For each test, run the same processing on the response
  // and compare to the result generated earlier.

  return map(
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(_ref4) {
      var _ref5, request, expected, url, options, actual;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _ref5 = _slicedToArray(_ref4, 2), request = _ref5[0], expected = _ref5[1];
              url = request.url, options = _objectWithoutProperties(request, ["url"]);
              _context3.t0 = responsify;
              _context3.next = 5;
              return (0, _network.fetch)(url, options);

            case 5:
              _context3.t1 = _context3.sent;
              actual = (0, _context3.t0)(_context3.t1);
              return _context3.abrupt("return", (0, _diff.createTwoFilesPatch)('expected', 'actual', expected, actual));

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
};

exports.test = test;