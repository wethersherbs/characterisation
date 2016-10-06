import test from 'tape'

import { Future } from '../../../lib/Control/Future'

test('Control.Future.bimap', assert => {
  let flag = true

  const testF = Future(rej => res => (flag ? res : rej)('hello, '))
    .bimap(h => h + 'world', h => h + 'wimbledon')

  testF.fork(
    _ => assert.fail('resolve'),
    x => assert.same('hello, wimbledon', x, 'bimaps resolve')
  )

  flag = !flag

  testF.fork(
    x => assert.same('hello, world', x, 'bimaps reject'),
    _ => assert.fail('rejects')
  )

  assert.end()
})
