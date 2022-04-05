const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Stop = require('../models/stops');
const Route = require('../models/route');
const testRoute = require('../models/testRoute');
const Mailer = require('nodemailer');



// These next two lines needed to get API_KEY from file
require('dotenv').config();
const API_KEY = process.env.API_KEY;
const MAIL_PW = process.env.MAIL_PW;

const router = express.Router();
// const route1 = {};

// mail transporter
const transporter = Mailer.createTransport({
    service: 'gmail',
    // secure: false,
    // requireTLS: true,
    auth: {
        user: 'mysmartsat@gmail.com',
        pass: MAIL_PW
    }
});

router.get('/', (req, res) => {
    res.render('home');
});
// router.delete('/', (req, res) => {
//     res.end(405, "Method not allowed");
// });

router.get('/team', (req, res) => {
    res.render('team');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

router.post('/contact',  (req, res) => {
    var user = req.body.name;
    var email = req.body.emailAddress;
    var message = req.body.emailBody;
    console.log(message, email, user);

    var mailMessage = {
        from: email,
        to: 'mysmartsat@gmail.com',
        subject: "Sent From mySmartSA",
        text: 'Name: ' + user + '\nEmail: ' + email + '\n\nMessage: \n\n' + message
    };

    transporter.sendMail(mailMessage, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email was sent successfully: ' + info.response);
        }
    });

    // probably need to use a redirect here
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
    testRoute.find({}).select('-_id') // returns all documents minus the '_id' field
        .then(result => {
            
            console.log(result);
            res.send({data: result});
        })
        .catch(err => console.log(err));
    
});

router.get('/map', (req, res) => {

    res.render('user');

});

router.get('/user', (req, res) => {

    res.render('demo', { api: API_KEY });


});

router.get('/bus', (req, res) => {

    res.render('bus');

});

router.post('/test'), (req, res) => {
    console.log(req.body.testDocument)

}

module.exports = router;
