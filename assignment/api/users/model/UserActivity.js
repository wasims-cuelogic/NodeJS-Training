'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird'); 

var UserActivity = new Schema({
    ip: { type: String },
    user_agent: { type: String },
    user_id : {type: Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date }
});

module.exports = mongoose.model('UserActivity', UserActivity);