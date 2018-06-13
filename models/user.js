const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({})
UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('user', UserSchema);

module.exports = User;
