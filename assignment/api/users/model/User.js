'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    reg_time: { type: Date, default: Date.now },
    admin: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', UserSchema);