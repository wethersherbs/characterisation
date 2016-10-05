import test from 'tape'

import '../../../src/Prelude'

test('Array.prototype.chain', assert => {
  const test = Symbol()

  assert.same([2], [1].chain(x => [x + 1]), 'chains singles')
  assert.same(
    [ 6, 0.5, 8, 1.5 ],
    [1, 3].chain(x => [x + 5, x / 2]),
    'chains multiples'
  )

  assert.end()
})
