const express = require('express')
const morgan = require('morgan')

const app = express()

// This is needs to be excluded, best practice
//app.disable('x-powered-by')

app.use(morgan('tiny'))


const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})