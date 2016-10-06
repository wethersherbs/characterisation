import test from 'tape'

import { fetch } from '../../lib/Network'
import { withServer } from '../server'

test('Network.fetch', assert => {
  withServer(fetch({ url: 'http://127.0.0.1:3000/' }))
    .fork(
      x => assert.fail('fails to request'),
      ({ status, headers, body }) => {
        assert.same(status, 200, 'Status matches')
        assert.same(headers, [], 'Header matches')
        assert.same(JSON.parse(body), { hello: 'world' }, 'Body matches')
      }
    )
})
