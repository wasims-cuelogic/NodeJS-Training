'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserActivity = new Schema({
    ip: { type: String },
    user_agent: { type: String },
    user_id : {type: String},
    date: { type: Date }
});

module.exports = mongoose.model('UserActivity', UserActivity);