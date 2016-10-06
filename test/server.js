import { createServer } from 'http'
import { Future } from '../lib/Control/Future'

// Promise to start a server instance.
// start : Server -> Future _ Server
const start = Future(rej => res => {
  const server = createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(JSON.stringify({ hello: 'world' }))
  })

  server.listen(3000, '127.0.0.1', _ => res(server))
})

// Promise to stop a server instance.
// stop : Server -> a -> Future _ a
const stop = server => data => Future(
  rej => res => server.close(_ => res(data))
)

// Run a callback with a running server instance.
// withServer : Future e a -> Future a e
export const withServer = action => start
  .chain(srv => action.chain(stop(srv)))
