// Automatic, general purpose characterisation.

import { composeN } from 'wi-jit'
import { pair } from './Prelude'

import { fetch as send } from './Network'
import { unit as Future } from './Control/Future'
import { createTwoFilesPatch as diff } from 'diff'

// Create an AJAX task for a test.
// fetch : (Response -> String) -> Request -> Future Error String
const fetch = ({ url, ... options }) => send(url, options)

// Convert a request spec into a testing task.
// testify : (Response -> String) -> Request -> Future Error Test
const testify = format => request =>
  request.map(composeN(pair(request), format))

// Run the request, and check that it matches the response.
const comparify = responsify => ([request, response]) =>
  fetch(req).map(composeN(diff(res), format))

// Generate tests for this characterisation suite.
// generate : Future e a -> (Response -> String) -> [Request] -> Future Error [Test]
export const generate = fixturify => responsify => composeN(
  fixturify.bind, sequence(Future), map(map(responsify), testify)
)

// Run the tests generated for this characterisation suite.
// test : Future e a -> (Response -> String) -> [Test] -> Future Error [Diff]
export const test = fixturify => responsify => composeN(
  fixturify.bind, sequence(Future), map(map(responsify), comparify)
)

// Convert a Promise-returning thunk to a Future.
// toFuture : Promise e a -> Future e a
export const toFuture = promiser => Future(
  flip(res => promiser().then(res).catch)
)
