import { request } from 'http'
import { parse } from 'url'

// Fetch a resource from a server using http.request.
// @TODO Make friendly with https? Or is there no point?
// fetch :: Request -> Promise Response Error
export const fetch = (url, options) => Promise(
  (res, rej) => request({ ... parse(url), ... options }, res => {
    const body = []
    const status = res.statusCode
    const headers = res.headers

    res.on('data', body.push.bind(body))
    res.on('end', _ => res({ status, headers, body }))
    res.on('error', rej)
  })
)
