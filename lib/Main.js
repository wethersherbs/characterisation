var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Automatic, general purpose characterisation.

import { fetch as send } from './Network';
import { unit as Future } from './Control/Future';
import { createTwoFilesPatch as diff } from 'diff';

// Carry out a formatted request.
// fetch : (Response -> Responsified) -> Request -> String
const fetch = responsify => _ref => {
  let url = _ref.url;

  let options = _objectWithoutProperties(_ref, ['url']);

  return map(responsify)(send(url)(options));
};

// Response = { body : String, headers : [String], status : Int }
// Responsified = String
// Request = { url : String, body : String, headers : [String] }
// Test = (Request, String)
// Diff = String

// Generate tests for this characterisation suite.
// generate : (-> *) -> (Response -> Responsified)
//   -> [Request] -> Future Error [Test]
export const generate = fixturify => responsify => {
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify();

  // Produce the promises of generated tests.
  // testify : [Request] -> Future Error [Test]
  return compose(sequence(Future))(map(request => {
    const url = request.url;

    const options = _objectWithoutProperties(request, ['url']);

    return map(x => [request, responsify(x)])(send(url)(options));
  }));
};

// Run the tests generated for this characterisation suite.
// test : (-> *) -> (Response -> Responsified)
//   -> [Test] -> Future Error [Diff]
export const test = fixturify => responsify => {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify();

  // Produce the diff results of the tests.
  // diffify : [Test] -> Future Error [Diff]
  return compose(sequence(Future))(map(_ref2 => {
    var _ref3 = _slicedToArray(_ref2, 2);

    let request = _ref3[0];
    let expected = _ref3[1];
    const url = request.url;

    const options = _objectWithoutProperties(request, ['url']);

    return map(x => diff('expected', 'actual', expected, responsify(x)))(send(url)(options));
  }));
};