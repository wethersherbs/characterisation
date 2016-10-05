import test from 'tape'

import { id } from 'wi-jit'
import '../../../src/Prelude'
import { unit } from '../../../src/Control/Future'

test('Array.prototype.sequence', assert => {
  const test = Symbol()

  assert.same(
    [2],
    [unit(2)]
      .sequence(unit)
      .fork(id, id),
    'sequences'
  )

  assert.end()
})
