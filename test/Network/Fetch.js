import test from 'tape'

import { fetch } from '../../lib/Network'
import '../server'

test('Network.fetch', assert => {
  // Get round Nock's monkey-patching.
  setTimeout(_ => assert.end())

  fetch({ url: 'http://www.example.com/' })
    .fork(
      x => assert.fail('fails to request'),
      ({ status, headers, body }) => {
        assert.same(status, 200, 'Status matches')
        assert.same(headers, [], 'Header matches')
        assert.same(JSON.parse(body), { hello: 'world' }, 'Body matches')
      }
    )
})
