const express = require('express')
const path = require('path')
const morgan = require('morgan')
const compression = require('compression')
const { createRequestHandler } = require('@remix-run/express')

const BUILD_DIR = path.join(process.cwd(), 'build')

const app = express()

// This is needs to be excluded, best practice
//app.disable('x-powered-by')

// Added compression
app.use(
  compression({
    filter: (_req, res) => {
      const contentTypeHeader = res.getHeader('Content-Type')
      let contentType = ''
      if (contentTypeHeader) {
        if (Array.isArray(contentTypeHeader)) {
          contentType = contentTypeHeader.join(' ')
        } else {
          contentType = String(contentTypeHeader)
        }
      }
      return !(contentType.includes('text/html') ||
        contentType.includes('text/event-stream'))
    },
  })
)

// Remix fingerprints its assets so we can cache forever.
app.use(
  '/build',
  express.static('public/build', { immutable: true, maxAge: '1y' })
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }))

app.use(morgan('tiny'))

app.all(
  '*',
  process.env.NODE_ENV === 'development'
    ? (req, res, next) => {
      purgeRequireCache()

      return createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })(req, res, next)
    }
    : createRequestHandler({
      build: require(BUILD_DIR),
      mode: process.env.NODE_ENV,
    })
)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. DX is better and this approach is clever, so it's included by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}