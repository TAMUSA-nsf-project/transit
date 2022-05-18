// Schema Model //
/**
 * will need to refine data definition...
 * blank model works since we aren't writing anything to the DB
*/
const mongoose = require('mongoose');  // connection to mongoDB

// data definition, empty mongoDB table
var testSchema = mongoose.Schema({
});

// how Node.js, makes schema available to rest of project
module.exports = mongoose.model('newRoute', testSchema);