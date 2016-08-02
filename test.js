import test from 'ava'

import { generate, test as tester } from './characterise'

test('generates 0 tests', assert => {
  const actual = generate(x => x, x => x)([])

  assert.deepEqual([], actual)
})
