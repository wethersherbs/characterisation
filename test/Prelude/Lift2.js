import test from 'tape'

import { lift2 } from '../../src/Prelude'

test('Prelude.lift2', assert => {
  const test1 = Symbol()
  const test2 = Symbol()

  assert.same(
    pair(test1, test2),
    [test1, test2]
  )

  assert.end()
})
