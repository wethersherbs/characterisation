import test from 'tape'

import { map } from '../../src/Prelude'

test('Prelude.map', assert => {
  const test = Symbol()

  map(
    test,
    { map: x => assert.same(test, x, 'maps') }
  )

  assert.end()
})
