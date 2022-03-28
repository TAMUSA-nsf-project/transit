const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pagesRouter = require('./routes/pages');
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

// Local MongoDB connection
// mongoose.connect('mongodb://localhost:27017/mapData', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         app.listen(4000, () => {
//             console.log('MongoDB is connected and Express server is running...');
//         });
//     });

// no backend connection...
// app.listen(3000, () => {
//     console.log('Express server is running');
// });  

// MongoDB Atlas connection
// mongoose.connect('mongodb://localhost:27017/mapData', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(`mongodb+srv://ahans03:${DB_KEY}@cluster0.aln1v.mongodb.net/mapData?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(8080, () => {  // changed for running on gcp...
        // app.listen(3000, () => {  // changed for running on localhost
            console.log('MongoDB is connected and Express server is running...');
        });
    });
