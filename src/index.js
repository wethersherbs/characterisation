// Automatic, general purpose characterisation.

import { fetch as send } from './network'
import { parse } from 'url'

import { createTwoFilesPatch as diff } from 'diff'

// Standard, curried functor map.
// map :: Functor f => f a -> (a -> b) -> f b
const map = xs => f => xs.map(f)

// Carry out a formatted request.
// fetch :: (Response -> ) -> Request -> Format
const fetch = responsify => async request => {
  const { url, ... options } = request

  return responsify(await send(url, options))
}

// Response     = { body :: String, headers :: [String], status :: Int }
// Responsified = String
// Request      = { url :: String, body :: String, headers :: [String] }
// Test         = (Request, String)
// Diff         = String

// Generate tests for this characterisation suite.
// generate :: (* -> *) -> (Response -> Responsified) -> [Request] -> [Test]
export const generate = (fixturify, responsify = (x => x.body)) => {
  // Before generating the tests, set the database state
  // to some known configuration as a starting point.
  fixturify()

  // Produce the promises of generated tests.
  // testify :: [Request] -> Promise [Test] Error
  return map(async request => {
    const { url, ... options } = request

    const response = responsify(
      await send(url, options)
    )

    return [request, response]
  })
}

// Run the tests generated for this characterisation suite.
// test :: (-> *) -> (Response -> Responsified) -> [Test] -> [Diff]
export const test = (fixturify, responsify) => {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify()

  // For each test, run the same processing on the response
  // and compare to the result generated earlier.
  return map(async ([request, expected]) => {
    const { url, ... options } = request

    const actual = responsify(await send(url, options))
    return diff('expected', 'actual', expected, actual)
  })
}
