import test from 'tape'

import { Future, unit } from '../../../src/Control/Future'

test('Control.Future.ap', assert => {
  unit(2).ap(unit(x => x * -100)).fork(
    _ => assert.fail('Lift to resolve'),
    x => assert.same(-200, x, 'applies')
  )

  assert.end()
})
