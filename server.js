const express = require('express')
const morgan = require('morgan')
const compression = require('compression')

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
        contentType.includes('text/event-stream'));
    },
  })
)

app.use(morgan('tiny'))


const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})