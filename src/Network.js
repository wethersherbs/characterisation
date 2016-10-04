import { request } from 'http'
import { parse } from 'url'

import { Future } from './Control/Future'

// newtype Response = { status : Int, headers : [String], body: String }

// Fetch a resource from a server using http.request.
// fetch : Request -> Future Error (IO Response)
export const fetch = url => options => Future(
  no => yes => request({ ... parse(url), ... options }, res => {
    const data = []
    const status = res.statusCode
    const headers = res.headers

    res.on('data', data.push.bind(data))
    res.on('error', no)
    res.on('end', () => {
      const body = data.join('')
      yes({ status, headers, body })
    })
  })
)
