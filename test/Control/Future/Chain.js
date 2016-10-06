import test from 'tape'

import { Future, unit } from '../../../lib/Control/Future'

test('Control.Future.map', assert => {
    let flag1 = true
    let flag2 = true

    const testF = Future(rej => res => flag1 ? res('hello, ') : rej('goodbye'))
      .chain(x => Future(rej => res => flag2 ? res(x + 'world') : rej(x + 'wimbledon')))

    testF.fork(
      _ => assert.fail('resolve'),
      x => assert.same('hello, world', x, 'chains resolve')
    )

    flag1 = !flag1

    testF.fork(
      x => assert.same('goodbye', x, 'short-circuits reject'),
      _ => assert.fail('rejects')
    )

    flag1 = !flag1
    flag2 = !flag2

    testF.fork(
      x => assert.same('hello, wimbledon', x, 'chains resolve to reject'),
      _ => assert.fail('rejects')
    )

    assert.end()
})
