import nock from 'nock'

nock('http://www.example.com')
  .persist().get('/').reply(
    200, JSON.stringify(
      { hello: 'world' }
    )
  )
