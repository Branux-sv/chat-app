const express = require('express')
const path = require('path')

const app = express()

const port = process.env.PORT || 3000
//Define public path
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('/', (req, resp) => {
    resp.render('index')
})

app.listen(port, () => {
    console.log('Server is running up in port ' + port)
})

