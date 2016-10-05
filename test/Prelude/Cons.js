import test from 'tape'

import { cons } from '../../src/Prelude'

test('Prelude.cons', assert => {
  assert.same([1, 2, 3], cons(1, [2, 3]), 'conses lists')
  assert.end()
})
