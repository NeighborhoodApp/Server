const express = require('express')
const PORT = 3000
const app = express()
const cors = require('cors')
const routes = require('./routes')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', routes)

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT)
})