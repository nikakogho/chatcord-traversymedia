const path = require('path')
const http = require('http')
const express = require('express')

const socketioLib = require('socket.io')

const { userJoined, getCurrentUser, getAllUsersOfRoom, removeUser } = require('./utils/users')

const moment = require('moment')

const app = express()
const server = http.createServer(app)
const io = socketioLib(server)

const publicpath = path.join(__dirname, 'public')

app.use(express.static(publicpath))

function getFormattedTime() {
    return moment().format('HH:mm')
}

function getServerMsg(msg) {
    return { msg, sender: 'server', room: 'server', sendTime: getFormattedTime() }
}

io.on('connection', socket => {
    console.log('New connection...')

    socket.emit('message', getServerMsg('hi'))

    // socket.broadcast.emit('message', getServerMsg('someobody entered the chat!'))

    socket.on('disconnect', () => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', getServerMsg(`${user.username} left the chat!`))
        io.to(user.room).emit('left', user.username)

        removeUser(user)
    })

    socket.on('chat-message', msg => {
        io.to(msg.room).emit('message', {...msg, sendTime: getFormattedTime()})
    })

    socket.on('join', ({ username, room }) => {
        const user = userJoined(socket.id, username, room)

        socket.join(user.room)

        socket.broadcast.to(user.room).emit('message', getServerMsg(`${username} entered the chat!`))
        socket.emit('init', getAllUsersOfRoom(room))
        socket.to(user.room).broadcast.emit('joined', username)
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Running on port ${PORT}`))