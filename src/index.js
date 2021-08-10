const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
//Define public path
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('/', (req, resp) => {
    resp.render('index')
})

io.on('connection', () => {
    console.log('New WebSocket Connection')
})

server.listen(port, () => {
    console.log('Server is running up in port ' + port)
})

