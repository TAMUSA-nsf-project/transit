// Schema Model //
/**
 * will need to refine data definition...
 * blank model works since we aren't writing anything to the DB
*/
const mongoose = require('mongoose');

var testSchema = mongoose.Schema({
});

module.exports = mongoose.model('newRoute', testSchema);