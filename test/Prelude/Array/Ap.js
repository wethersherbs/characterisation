import test from 'tape'

import '../../../lib/Prelude'

test('Array.prototype.ap', assert => {
  assert.same([2], [1].ap([x => x + 1]), 'applies singles')
  assert.same(
    [ 6, 8, 0.5, 1.5 ],
    [1, 3].ap([x => x + 5, x => x / 2]),
    'applies multiples'
  )

  assert.end()
})
