var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    email: String,
    score: Number,
    time: Number,
    tries: Number
});

mongoose.model('Users', UserSchema);
