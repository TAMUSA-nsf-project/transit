// Schema Model //
/* will need to refine data definition...
*   all stop info is experimental at this point
*   
*/

const mongoose = require('mongoose');

var stopSchema = mongoose.Schema({
    title:{
        type: String
    }, 
    lat:{
        type: Number
    }, 
    lng: {
        type: Number
    }, 
    routes:{
        type: Array
    }
});

module.exports = mongoose.model('Stop', stopSchema);