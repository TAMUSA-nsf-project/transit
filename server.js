const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pagesRouter = require('./router/pages');
const mongoose = require('mongoose');

var helmet = require('helmet');  //to fix header and server leak info
/*
** This may be required later if needing to create endpoint to handle client requests **
*/
require('dotenv').config();
// const API_KEY = process.env.API_KEY;
const DB_KEY = process.env.DB_KEY;
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet.frameguard())
app.use(helmet.noSniff());
app.disable('x-powered-by')  //hide the server name, this fix 'server leaks information via http' alert
app.use('/', pagesRouter);

var httpsServer = require('https').createServer();
const server = require('http').createServer(app);
let io = require("socket.io")(server)
io.attach(httpsServer)

var busses = []
io.on("connection", socket => {
    // console.log("initial transport", socket.conn.transport.name);

    for(let i = 0; i < busses.length; i++) {
        socket.emit("locations", busses[i]);
    }
    socket.on("hello", (arg, callback) => {
        console.log(arg); // "world"
        callback("got it");
    });

    socket.on('busConnection', () => {
        // define bus here... can add values based on route the bus is on which will be retrieved by map
        const bus = {
            // route: <some code from client where bus actually picks which route it is on>
            id: socket.id,
            lat: null,
            long: null
        }
        busses.push(bus)
        console.log("from BUSCONNECTION function... Socket ID: ", bus.id)
    })

    socket.on('update', data => {
        for (let i = 0; i < busses.length; i++) {
            if (busses[i].id === socket.id) {
                busses[i].lat = data.lat
                busses[i].long = data.long
                console.log('From UPDATE function:', busses[i])
                break
            }
        }
        // console.log('From UPDATE function:', data)
    })

    socket.on('disconnect', () => {
        for (let i = 0; i < busses.length; i++) {
            if (busses[i].id === socket.id) {
                busses.splice(i, 1)
                break
            }
        }
    })

setInterval(() => {
    const busLocations = busses.map(bus => {
        return {
            //route: bus.route
            id: bus.id,
            lat: bus.lat,
            long: bus.long
        }
    })
    io.emit('tick', busLocations)
    // console.log(busLocations)
}, 5000)

});

// Define server port and a string of the server address for use in message printed to stdout
// that notifies the user that the server is running and to copy/paste the address into their browser
const SERVER_PORT = 8080
const SERVER_ADDRESS = `localhost:${SERVER_PORT}`

// MongoDB Atlas connection
// mongoose.connect('mongodb://localhost:27017/mapData', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(`mongodb+srv://ahans03:${DB_KEY}@cluster0.aln1v.mongodb.net/mapData?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // app.listen(8080, () => {  // changed for running on gcp...
        server.listen(SERVER_PORT, () => {  // changed for running on localhost
            console.log('MongoDB is connected and express server is running.\n' +
                'Copy/paste the following URL into your browser:\n  ' +
                SERVER_ADDRESS);
        });
    });
