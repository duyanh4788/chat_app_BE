const socket = io();

const getEle = (id) => {
    return document.getElementById(id)
}
getEle('divNotify').style.display = 'none';

getEle('formMessage').addEventListener('submit', (e) => {
    e.preventDefault()
    let messageInput = getEle('inputMessage').value;
    const acknowLedGements = (error) => {
        if (error) {
            alert('Error')
            getEle('divNotify').style.display = 'block';
            getEle('notify').innerHTML = "Message Not Available"
        } else {
            getEle('divNotify').style.display = 'block';
            getEle('notify').innerHTML = "Success"
        }
    }
    socket.emit("send message", messageInput, acknowLedGements)
})

socket.on('send message', ({ message, createAt }) => {
    getEle('receviMessage').value = message
    getEle('timeReciver').innerHTML = createAt
})

socket.on('send message notify', (message) => {
    console.log(message);
    getEle('notifyJoin').innerHTML = message
})

getEle('shareLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return ('Browser not support get Location')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('client send location', location)
    })
})

socket.on('server send location', (location) => {
    console.log(location);
    getEle('notifyMessage').innerHTML = location
})

/**query string */
const queryString = location.search
const params = Qs.parse(queryString, { ignoreQueryPrefix: true })
const { room, userRoom } = params;
socket.emit('join room', { room, userRoom })

/** render list client inside room */
socket.on('send list client inside room', (userList) => {
    console.log(userList);
})

/**add user join room */
socket.emit('add client join room', ({ room, userRoom }))