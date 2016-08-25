// Automatic, general purpose characterisation.

import { fetch as send } from './Network'
import { unit as Future } from './Control/Future'
import { createTwoFilesPatch as diff } from 'diff'

// Carry out a formatted request.
// fetch : (Response -> Responsified) -> Request -> String
const fetch = responsify => ({ url, ... options }) =>
  map(responsify)(send(url)(options))

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
  fixturify()

  // Produce the promises of generated tests.
  // testify : [Request] -> Future Error [Test]
  return compose(sequence(Future))(
    map(request => {
      const { url, ... options } = request

      return map
        (x => [request, responsify(x)])
        (send(url)(options))
    })
  )
}

// Run the tests generated for this characterisation suite.
// test : (-> *) -> (Response -> Responsified)
//   -> [Test] -> Future Error [Diff]
export const test = fixturify => responsify => {
  // Before testing, set the database state to the same
  // configuration used at generation time.
  fixturify()

  // Produce the diff results of the tests.
  // diffify : [Test] -> Future Error [Diff]
  return compose(sequence(Future))(
    map(([request, expected]) => {
      const { url, ... options } = request

      return map
        (x => diff(
          'expected', 'actual',
          expected, responsify(x)
        ))
        (send(url)(options))
    })
  )
}
