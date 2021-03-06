'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userModel = new Schema({
    fname: { type: String, required: true, index: { unique: true } },
    lname: { type: String, required: true, index: { unique: true } },
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    admin: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', userModel);