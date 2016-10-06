import test from 'tape'

import { unit } from '../../../lib/Control/Future'

test('Control.Future.unit', assert => {
  const test = Symbol()

  unit(test).fork(
    _ => assert.fail('lifts to resolve'),
    x => assert.same(test, x, 'lifts into applicative')
  )

  assert.end()
})
