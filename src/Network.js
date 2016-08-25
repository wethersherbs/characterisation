import { request } from 'http'
import { parse } from 'url'

import { Future } from './Control/Future'
import { unit as IO } from './Control/IO'

// newtype Response = { status : Int, headers : [String], body: String }

// Fetch a resource from a server using http.request.
// fetch : Request -> Future Error (IO Response)
export const fetch = url => options => Future(
  no => yes => request({ ... parse(url), ... options }, res => {
    const body = []
    const status = res.statusCode
    const headers = res.headers

    res.on('data', x => body.push(x))
    res.on('error', no)
    res.on('end', () => yes(
      IO({
        status,
        headers,
        body: body.join('')
      })
    ))
  })
)
