const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $buttonSendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message)  => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm:ss a") 
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationInfo)  => {
    console.log(locationInfo)
    const html = Mustache.render(locationTemplate, {
        username: locationInfo.username,
        url: locationInfo.url,
        createdAt: moment(locationInfo.createdAt).format("h:mm:ss a") 
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message , (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('Message was delivered') 
    })

})

$buttonSendLocation.addEventListener('click', () => {
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.');
    }

    $buttonSendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $buttonSendLocation.removeAttribute('disabled')
            console.log('Location Shared!') 
        })
    }) 
})

socket.emit('join', { username, room }, (error) => {
    if (error){
        alert(error)
        location.href = '/'
    }
})
