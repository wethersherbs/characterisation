// Automatic, general purpose characterisation.

import fetch from 'node-fetch'
import { diffWords as diff } from 'diff'

// Send a request to the app. We can't necessarily start a request
// before the last has totally completed, in case output is unbuffered.
// send :: Request -> Promise Response
const send = ({ url, ... options }) => fetch(url, options)
  .then(({ headers, status, ... res }) => ({
    headers, status, json: res.json()
  }))

// Response = { body :: String, headers :: [String], status :: Int }
// Request  = { url :: String, body :: String, headers :: [String] }
// Test     = [Request, Response]
// Diff     = ?

// Generate tests for this characterisation suite.
// generate :: (* -> *) -> (Response -> String) -> [Request] -> [Test]
export const generate = (fixturify, responsify) => requests => {
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify()

  // For every request, make the call, do any output
  // processing, and then return the storable responses.
  return requests.map(
    r => send(r)
      .then(responsify)
      .then(x => [r, x])
  )
}

// Run the tests generated for this characterisation suite.
// test :: (* -> *) -> (Response -> String) -> [Test] -> [Diff]
export const test = (fixturify, responsify) => tests => {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify()

  // For each test, run the same processing on the response
  // and compare to the result generated earlier.
  return tests.map(
    ([req, res]) => send(req)
      .then(responsify)
      .then(x => diff(res, x))
  )
}
