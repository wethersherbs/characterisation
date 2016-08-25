'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.generate = undefined;

var _http = require('http');

var _url = require('url');

var _diff = require('diff');

// compose : (b -> c) -> (a -> b) -> a -> c
const compose$1 = f => g => x => f(g(x));

// id : a -> a
const id = x => x;

// Create a Future type from a binary function
// Future : ((e -> b) -> (a -> b) -> b) -> Future e a
const Future = x => {
  // ap : Future e (a -> b) | Future e a -> Future e b
  const ap = b => chain(b.map);

  // bimap : Future e a | (e -> f) -> (a -> b) -> Future f b
  const bimap = f => g => Future(rej => res => x.fork(compose$1(f)(rej))(compose$1(g)(res)));

  // chain : Future e a | (a -> Future e b) -> Future e b
  const chain = f => Future(rej => res => f(x).fork(rej)(res));

  // join : Future e (Future e a) | Future e a
  const join = () => Future(rej => res => x.fork(rej, y => y.fork(rej, res)));

  // map : Future e a | (a -> b) -> Future e b
  const map = bimap(id);

  return { ap, bimap, chain, join, map };
};

// unit : a -> Future e a
const unit = x => Future(rej => res => res(x));

// compose : (b -> c) -> (a -> b) -> a -> c
const compose$2 = f => g => x => f(g(x));

// K : a -> b -> a
const K$1 = x => _ => x;

// Create an IO type from a thunk.
// IO : (-> a) -> IO a
const IO = f => {
  // ap : IO (a -> b) | IO a -> IO b
  const ap = g => chain(g.map);

  // chain : IO a | (a -> IO b) -> IO b
  const chain = compose$2(IO)(compose$2(unsafePerform));

  // join : IO IO a | IO a
  const join = () => IO(() => f().unsafePerform());

  // map : IO a | (a -> b) -> IO a -> IO b
  const map = g => chain(compose$2(IO)(g));

  return {
    ap,
    chain,
    join,
    map,
    unsafePerform: f
  };
};

// unit : a -> IO a
const unit$1 = compose$2(IO)(K$1);

// unsafePerform : IO a | a
const unsafePerform = x => x.unsafePerform();

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
const fetch$1 = url => options => Future(no => yes => (0, _http.request)(_extends({}, (0, _url.parse)(url), options), res => {
  const body = [];
  const status = res.statusCode;
  const headers = res.headers;

  res.on('data', x => body.push(x));
  res.on('error', no);
  res.on('end', () => yes(unit$1({
    status,
    headers,
    body: body.join('')
  })));
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

// Carry out a formatted request.
// fetch : (Response -> Responsified) -> Request -> String
const fetch = responsify => _ref => {
  let url = _ref.url;

  let options = _objectWithoutProperties(_ref, ['url']);

  return map(responsify)(fetch$1(url)(options));
};

// Response = { body : String, headers : [String], status : Int }
// Responsified = String
// Request = { url : String, body : String, headers : [String] }
// Test = (Request, String)
// Diff = String

// Generate tests for this characterisation suite.
// generate : (-> *) -> (Response -> Responsified)
//   -> [Request] -> Future Error [Test]
const generate = fixturify => responsify => {
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify();

  // Produce the promises of generated tests.
  // testify : [Request] -> Future Error [Test]
  return compose(sequence(unit))(map(request => {
    const url = request.url;

    const options = _objectWithoutProperties(request, ['url']);

    return map(x => [request, responsify(x)])(fetch$1(url)(options));
  }));
};

// Run the tests generated for this characterisation suite.
// test : (-> *) -> (Response -> Responsified)
//   -> [Test] -> Future Error [Diff]
const test = fixturify => responsify => {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify();

  // Produce the diff results of the tests.
  // diffify : [Test] -> Future Error [Diff]
  return compose(sequence(unit))(map(_ref2 => {
    var _ref3 = _slicedToArray(_ref2, 2);

    let request = _ref3[0];
    let expected = _ref3[1];
    const url = request.url;

    const options = _objectWithoutProperties(request, ['url']);

    return map(x => (0, _diff.createTwoFilesPatch)('expected', 'actual', expected, responsify(x)))(fetch$1(url)(options));
  }));
};

exports.generate = generate;
exports.test = test;

