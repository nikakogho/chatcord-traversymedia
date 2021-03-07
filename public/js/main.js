const socket = io()
const chatForm = document.getElementById('chat-form')

const query = window.location.search
const urlParams = new URLSearchParams(query)

const username = urlParams.get('username')
const room = urlParams.get('room')

const messagesDiv = document.getElementById('messages')
const usersDiv = document.getElementById('users')

const msgTextElement = document.getElementById('msg')

document.getElementById('room-name').innerHTML = room

socket.emit('join', {username, room})

socket.on('message', ({msg, sender, room, sendTime}) => {
    console.log(msg)
    writeMessageOnScreen(msg, sender, sendTime)

    // socket.broadcast.emit('nice', 'indeed')

    messagesDiv.scrollTop = messagesDiv.scrollHeight
})

socket.on('init', users => {
    for(let user of users) addUsername(user.username)
})

socket.on('joined', username => addUsername(username))
socket.on('left', username => removeUsername(username))

chatForm.addEventListener('submit', e => {
    e.preventDefault() // dont refresh the page

    const msg = msgTextElement.value

    msgTextElement.value = ''
    msgTextElement.focus()

    const toSend = {
        msg,
        sender: username,
        room
    }

    socket.emit('chat-message', toSend)
})

function writeMessageOnScreen(msg, sender, sendTime) {
    const msgDiv = document.createElement('div')
    msgDiv.classList.add('message')

    const metaP = document.createElement('p')
    metaP.classList.add('meta')
    metaP.innerHTML = `${sender} <span>${sendTime}</span>`

    const textP = document.createElement('p')
    textP.classList.add('text')
    textP.innerHTML = msg

    msgDiv.appendChild(metaP)
    msgDiv.appendChild(textP)

    messagesDiv.appendChild(msgDiv)
}

function addUsername(username) {
    const userElement = document.createElement('li')

    userElement.innerHTML = username

    usersDiv.appendChild(userElement)
}

function removeUsername(username) {
    for(let child of usersDiv.children) {
        if(child.innerHTML === username) {
            child.remove()
            break
        }
    }
}