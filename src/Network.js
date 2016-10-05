import { request } from 'http'
import { parse } from 'url'

import { Future } from './Control/Future'

// newtype Response = { status : Int, headers : [String], body: String }

// Fetch a resource from a server using http.request.
// fetch : Request -> Future Error (IO Response)
export const fetch = url => options => Future(
  no => yes => request({ ... parse(url), ... options }, res => {
    const data = []

    res.on('data', x => data.push(x))
    res.on('error', no)
    res.on(
      'end', () => yes({
        status: res.statusCode,
        headers: res.headers,
        body: data.join('')
      })
    )
  })
)
