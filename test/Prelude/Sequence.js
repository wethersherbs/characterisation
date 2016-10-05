import test from 'tape'

import { sequence } from '../../src/Prelude'

test('Prelude.sequence', assert => {
  const test = Symbol()

  sequence(
    test,
    { sequence: x => assert.same(test, x, 'sequences') }
  )

  assert.end()
})
