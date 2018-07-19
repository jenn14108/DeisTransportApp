var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema(
    {
        session: {
            type: String,
            required: true,
        },
        stop: {
            type: String,
            required: false,
        },
        route: {
            type: String,
            required: false,
        },
    }
);

//Export model
module.exports = mongoose.model('Session', SessionSchema);
