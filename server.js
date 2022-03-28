const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pagesRouter = require('./routes/pages');
const mongoose = require('mongoose');

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

app.use('/', pagesRouter);

const server = require('http').createServer(app);
const io = require('socket.io')(server)
const busses = []
io.on("connection", (socket) => {
    console.log("initial transport", socket.conn.transport.name);
    socket.on("hello", (arg, callback) => {
        console.log(arg); // "world"
        callback("got it");
    });

    socket.on('busConnection', () => {
        const bus = {
            socket,
            lat: null,
            long: null
        }
        busses.push(bus)
        console.log(bus)
    })

    socket.on('update', data => {
        for (let i = 0; i < busses.length; i++) {
            if (busses[i].socket.id === socket.id) {
                busses[i].lat = data.lat
                busses[i].long = data.long
                break
            }
        }
        console.log(data)
    })

    socket.on('disconnect', () => {
        for (let i = 0; i < busses.length; i++) {
            if (busses[i].socket.id === socket.id) {
                busses.splice(i, 1)
                break
            }
        }
    })

setInterval(() => {
    const busLocations = busses.map(bus => {
        return {
            lat: bus.lat,
            long: bus.long
        }
    })
    io.emit('tick', busLocations)
    console.log(busLocations)
}, 2000)

});
// MongoDB Atlas connection
// mongoose.connect('mongodb://localhost:27017/mapData', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(`mongodb+srv://ahans03:${DB_KEY}@cluster0.aln1v.mongodb.net/mapData?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // app.listen(8080, () => {  // changed for running on gcp...
        server.listen(3000, () => {  // changed for running on localhost
            console.log('MongoDB is connected and Express server is running...');
        });
    });
