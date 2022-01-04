const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Stop = require('../models/stops');
const Route = require('../models/route');


// These next two lines needed to get API_KEY from file
require('dotenv').config();
const API_KEY = process.env.API_KEY;

const router = express.Router();
// const route1 = {};

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/team', (req, res) => {
    res.render('team');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.get('/social', (req, res) => {
    res.render('social');
});

router.get('/sec_priv', (req, res) => {
    res.render('sec_priv');
});

router.get('/mobile_architecture', (req, res) => {
    res.render('mobile_architecture');
});

router.get('/goals', (req, res) => {
    res.render('goals');
});

router.get('/ETA_research', (req, res) => {
    res.render('ETA_research');
});

/* get all data from DB in one go...
*   better data definition and query parameters to come...
*   Ultimately would like to request and return only one object
*/
router.get('/stops', (req, res) => {
    // get JSON with all stops
    Stop.find().sort({ _id: 1 })  // added sort() function to ensure stops in order
        .then(stops => {
            // get JSON with all routes
            Route.find()
                .then(routes => {
                    // send the JSONs to map
                    // res.send({ data: [stops, routes]});
                    res.send({ data: { stops: stops, routes: routes } });
                    // console.log(stops);
                    console.log(routes);
                })
                .catch(err => console.log(err));
            // res.send({ data: stops });
            // console.log(stops);
        })
        .catch(err => console.log(err));
});

router.get('/addstop', (req, res) => {
    // get JSON with all stops
    console.log(req.body.stopNum);

    Routec.collection.insertOne({
        "title": "test",
        "lat": 123,
        "lng": 456,
        "routes": {
            "r1": 6,
            "r2": 7
        }
    })
        .then(res => console.log(res))
        .catch(err => console.log(err));
});

router.get('/map', (req, res) => {

    res.render('demo', { api: API_KEY });

});

router.post('/test'), (req, res) => {
    console.log(req.body.testDocument)

}

module.exports = router;

