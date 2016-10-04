'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toFuture = exports.test = exports.generate = undefined;

var _wiJit = require('wi-jit');

var _http = require('http');

var _url = require('url');

var _diff = require('diff');

// concat : Semigroup a => a -> a -> a
const concat = (0, _wiJit.uncurryN)(xs => ys => xs.concat(ys));

// equals : Setoid a => a -> a -> Bool
const equals = (0, _wiJit.uncurryN)(x => y => x.equals ? x.equals(y) : x === y);

// lift2 : Applicative f => (a -> b -> c) -> f a -> f b -> f c
const lift2 = (0, _wiJit.uncurryN)(f => a => a.map(f).ap);

// map : Functor f => (a -> b) -> f a -> f b
const map$1 = (0, _wiJit.uncurryN)(f => xs => xs.map(f));

// pair : a -> b -> (a, b)
const pair = (0, _wiJit.uncurryN)(a => b => [a, b]);

// sequence : (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
const sequence$1 = (0, _wiJit.uncurryN)(unit => xs => xs.traverse(_wiJit.id, unit));

// traverse : (Applicative f, Traversable t) =>
//   (a -> f b) -> (a -> f a) -> f (t b)
const traverse = (0, _wiJit.uncurryN)(f => unit => xs => xs.traverse(f)(unit));

const Future = fork => {
  const bimap = (0, _wiJit.uncurryN)(f => g => Future(rej => res => fork((0, _wiJit.composeN)(f, rej), (0, _wiJit.composeN)(g, res))));

  const chain = f => Future(rej => res => fork(rej, x => f(x).fork(rej, res)));

  const map = bimap(_wiJit.id);

  return { ap: chain(map), bimap, chain, map, fork };
};

// unit : a -> Future e a
const unit = x => Future(rej => res => res(x));

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

// newtype Response = { status : Int, headers : [String], body: String }

// Fetch a resource from a server using http.request.
// fetch : Request -> Future Error (IO Response)
const fetch$1 = url$$1 => options => Future(no => yes => (0, _http.request)(_extends({}, (0, _url.parse)(url$$1), options), res => {
  const data = [];
  const status = res.statusCode;
  const headers = res.headers;

  res.on('data', data.push.bind(data));
  res.on('error', no);
  res.on('end', () => {
    const body = data.join('');
    yes({ status, headers, body });
  });
}));

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function _objectWithoutProperties(obj, keys) {
  var target = {};for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];
  }return target;
}

// Automatic, general purpose characterisation.

// Create an AJAX task for a test.
// fetch : (Response -> String) -> Request -> Future Error String
const fetch$$1 = _ref => {
  let url$$1 = _ref.url;

  let options = _objectWithoutProperties(_ref, ['url']);

  return fetch$1(url$$1, options);
};

// Convert a request spec into a testing task.
// testify : (Response -> String) -> Request -> Future Error Test
const testify = format => request$$1 => request$$1.map((0, _wiJit.composeN)(pair(request$$1), format));

// Run the request, and check that it matches the response.
const comparify = responsify => _ref2 => {
  var _ref3 = _slicedToArray(_ref2, 2);

  let request$$1 = _ref3[0];
  let response = _ref3[1];
  return fetch$$1(req).map((0, _wiJit.composeN)((0, _diff.createTwoFilesPatch)(res), format));
};

// Generate tests for this characterisation suite.
// generate : Future e a -> (Response -> String) -> [Request] -> Future Error [Test]
const generate = fixturify => responsify => (0, _wiJit.composeN)(fixturify.bind, sequence(unit), map(map(responsify), testify));

// Run the tests generated for this characterisation suite.
// test : Future e a -> (Response -> String) -> [Test] -> Future Error [Diff]
const test = fixturify => responsify => (0, _wiJit.composeN)(fixturify.bind, sequence(unit), map(map(responsify), comparify));

// Convert a Promise-returning thunk to a Future.
// toFuture : Promise e a -> Future e a
const toFuture = promiser => unit(flip(res => promiser().then(res).catch));

exports.generate = generate;
exports.test = test;
exports.toFuture = toFuture;

