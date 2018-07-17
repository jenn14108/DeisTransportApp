var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema(
    {
        session: {
            type: String,
            required: true,
        },
        keyword: {
            type: String,
            required: true,
        },
    }
);

//Export model
module.exports = mongoose.model('Session', SessionSchema);
