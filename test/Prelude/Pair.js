import test from 'tape'

import { pair } from '../../src/Prelude'

test('Prelude.pair', assert => {
  const test1 = Symbol()
  const test2 = Symbol()

  assert.same(
    pair(test1, test2),
    [test1, test2]
  )

  assert.end()
})
