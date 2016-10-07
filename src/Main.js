// Automatic, general purpose characterisation.

import { composeN, constant, uncurryN } from 'wi-jit'
import { map, pair, sequence } from './Prelude'

import { unit, Future } from './Control/Future'
import { fetch } from './Network'
import { createTwoFilesPatch } from 'diff'

// Diff two strings as expected vs actual.
// diff : String -> String -> String
const diff = uncurryN(
  x => y => createTwoFilesPatch(
    'expected', 'actual', x, y
  )
)

// Convert a request spec into a testing task.
// testify : (Response -> String) -> Request -> Future Error Test
const testify = format => request =>
  request.map(composeN(pair(request), format))

// Run the request, and check that it matches the response.
const comparify = responsify => ([request, response]) =>
  fetch(request).map(composeN(diff(response), responsify))

// Generate tests for this characterisation suite.
// generate : Future e a -> (Response -> String) -> [Request] -> Future Error [Test]
export const generate = fixturify => responsify => composeN(
  fixturify.chain, constant, sequence(unit), map(map(responsify), testify)
)

// Run the tests generated for this characterisation suite.
// test : Future e a -> (Response -> String) -> [Test] -> Future Error [Diff]
export const test = fixturify => responsify => composeN(
  fixturify.chain, constant, sequence(unit), map(map(responsify), comparify)
)

// Convert a Promise-returning thunk to a Future.
// toFuture : Promise e a -> Future e a
export const toFuture = promiser => Future(
  rej => res => promiser().then(res).catch(rej)
)
