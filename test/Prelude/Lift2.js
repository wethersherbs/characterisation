import test from 'tape'

import { id } from 'wi-jit'
import { lift2, pair } from '../../lib/Prelude'
import { unit } from '../../lib/Control/Future'

test('Prelude.lift2', assert => {
  const test1 = Symbol()
  const test2 = Symbol()

  assert.same(
    lift2(pair, unit(test1), unit(test2)).fork(id, id),
    [test1, test2],
    'lifts function into applicative'
  )

  assert.end()
})
