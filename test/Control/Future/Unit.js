import test from 'tape'

import { unit } from '../../../src/Control/Future'

test('Control.Future.unit', assert => {
  unit(2).map(x => x + 3).fork(
    _ => assert.fail('Lift to resolve'),
    x => assert.same(5, x, 'Lifts into applicative.')
  )

  assert.end()
})
