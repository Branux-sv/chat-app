const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const URL_GOOGLE_MAPS = 'https://google.com/maps?q='

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

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message',generateMessage(username + ' has joined!'))
    })

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }

         io.to('tmp..').emit('message', generateMessage(msg))
         callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage("a user has left :("))
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage( URL_GOOGLE_MAPS + coords.latitude + ',' + coords.longitude)) 
        callback()
    })


})

server.listen(port, () => {
    console.log('Server is running up in port ' + port)
})

