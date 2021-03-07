const users = []

function userJoined(id, username, room) {
    const user = { id, username, room }

    users.push(user)

    return user
}

function getCurrentUser(id) {
    return users.find(u => u.id === id)
}

function getAllUsersOfRoom(room) {
    return users.filter(u => u.room === room)
}

function removeUser(user) {
    for(let i = 0; i < users.length; i++) if(users[i].id === user.id) {
        users.splice(i, 1)
        return
    }
}

module.exports = { userJoined, getCurrentUser, getAllUsersOfRoom, removeUser }