const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const URL_GOOGLE_MAPS = 'https://google.com/maps?q='
const Users = require('./utils/users')

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

    socket.on('join', (options, callback) => {
        const { error, user } = Users.addUser({id: socket.id, ...options})
        
        if (error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username + ' has joined!'))
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()

        if (filter.isProfane(msg)){
            return callback('Profanity is not allowed!')
        }

         io.to('sex').emit('message', generateMessage(msg))
         callback()
    })

    socket.on('disconnect', () => {
        const user = Users.removeUser(socket.id)        
        if(user){
            io.to(user.room).emit('message', generateMessage( user.username + " has left :("))
        }
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage( URL_GOOGLE_MAPS + coords.latitude + ',' + coords.longitude)) 
        callback()
    })


})

server.listen(port, () => {
    console.log('Server is running up in port ' + port)
})

