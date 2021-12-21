// put bus tracking stuff here...
// was able to combine in node/html framework... 
$(document).on('ready', () => {
    const socket = io('/')
    const root = document.getElementById('root')
  
    socket.emit('busConnection')
  
    socket.on('tick', busses => {
      navigator.geolocation.watchPosition(pos => {
        const lat = pos.coords.latitude
        const long = pos.coords.longitude
        socket.emit('update', {lat, long})
      })
    })
  })