// Schema Model //
/* will need to refine data definition...
*   all stop info is experimental at this point
*   
*/
const mongoose = require('mongoose');

var routeSchema = mongoose.Schema({
    title: String,
    lat: Number,
    lng: Number,
    routes: {
        r1: Number,
        r2: Number
    }
});

module.exports = mongoose.model('Routec', routeSchema);
