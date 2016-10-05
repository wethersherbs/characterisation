import test from 'tape'

import { concat } from '../../src/Prelude'

test('Prelude.concat', assert => {
  assert.same([2, 3], concat([2], [3]), 'concats lists')
  assert.same('hi', concat({ concat: _ => 'hi' }, null), 'concats')

  assert.end()
})
