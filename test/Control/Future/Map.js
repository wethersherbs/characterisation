import test from 'tape'

import { unit } from '../../../lib/Control/Future'

test('Control.Future.map', assert => {
  unit(2).map(x => x + 3).fork(
    _ => assert.fail('lifts to resolve'),
    x => assert.same(5, x, 'maps resolve')
  )

  assert.end()
})
