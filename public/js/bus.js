// put bus tracking stuff here...
// was able to combine in node/html framework...
var watchID;
var geoLoc;
const socket = io()

function showLocation(position) {
    // This emits or broadcasts the location via web sockets
    // anyone connected to the socket can see the location
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    alert("Latitude : " + latitude + " Longitude: " + longitude);
    socket.emit('update', {lat, long});
}

function errorHandler(err) {
    if(err.code == 1) {
        alert("Error: Access is denied!");
    } else if( err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}

function getLocationUpdate(){
    // This uses geolocation.watchPosition method to get the user's location and invoke a callback function
    // whenever it changes. Callback function is showLocation, which broadcasts the user's coordinates using
    // web sockets.

    if(navigator.geolocation){

        // timeout at 60000 milliseconds (60 seconds)
        var options = {timeout:60000};
        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    } else {
        alert("Sorry, browser does not support geolocation!");
    }
}

// $(document).ready(function() {
//     var watchID;
//     var geoLoc;
//     const socket = io()
//
//     function showLocation(position) {
//         var latitude = position.coords.latitude;
//         var longitude = position.coords.longitude;
//         alert("Latitude : " + latitude + " Longitude: " + longitude);
//         socket.emit('update', {lat, long});
//     }
//
//     function errorHandler(err) {
//         if(err.code == 1) {
//             alert("Error: Access is denied!");
//         } else if( err.code == 2) {
//             alert("Error: Position is unavailable!");
//         }
//     }
//
//     function getLocationUpdate(){
//
//         if(navigator.geolocation){
//
//             // timeout at 60000 milliseconds (60 seconds)
//             var options = {timeout:60000};
//             geoLoc = navigator.geolocation;
//             watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
//         } else {
//             alert("Sorry, browser does not support geolocation!");
//         }
//     }
// })

