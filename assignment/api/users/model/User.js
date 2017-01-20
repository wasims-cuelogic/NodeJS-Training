'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

var UserSchema = new Schema({
    fname: {
        type: String,
        required: "First Name is required"
    },
    lname: {
        type: String,
        required: "Last Name is required"
    },
    email: {
        type: String,
        required: "Email is required",
        index: { unique: true }
    },
    username: {
        type: String,
        required: "Username is required",
        index: { unique: true }
    },
    password: {
        type: String,
        required: "Password is required"
    },
    reg_time: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        required: true
    }
});

// UserSchema.statics.findUser = function findUser(id, cb) {
//     return this.find({
//         _id: id
//     }, cb).select('-password -__v').exec();
// }

module.exports = mongoose.model('User', UserSchema);