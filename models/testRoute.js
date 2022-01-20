// Schema Model //
/* will need to refine data definition...
*   all stop info is experimental at this point
*   
*/
const mongoose = require('mongoose');

var testSchema = mongoose.Schema({
});

module.exports = mongoose.model('newRoute', testSchema);