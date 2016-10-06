import test from 'tape'

import { chain } from '../../lib/Prelude'

test('Prelude.chain', assert => {
  const test = Symbol()

  chain(
    test,
    { chain: x => assert.same(test, x, 'chains') }
  )

  assert.end()
})
