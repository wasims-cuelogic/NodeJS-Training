'use strict';

var Boom = require('boom');
var User = require('../model/User');
var bcrypt = require('bcrypt');

function verifyUniqueUser(req, res) {
    // Find an entry from the database that
    // matches either the email or username
    User.findOne({
        $or: [{ email: req.payload.email }, { username: req.payload.username }]
    }, function (err, user) {
        // Check whether the username or email
        // is already taken and error out if so
        if (user) {
            if (user.username === req.payload.username) {
                res(Boom.badRequest('Username taken'));
                return;
            }
            if (user.email === req.payload.email) {
                res(Boom.badRequest('Email taken'));
                return;
            }
        }
        // If everything checks out, send the payload through
        // to the route handler
        res(req.payload);
    });
}

function verifyCredentials(req, res) {

    var password = req.payload.password;

    // Find an entry from the database that
    // matches either the email or username
    User.findOne({
        $or: [{ email: req.payload.email }, { username: req.payload.username }]
    }, function (err, user) {
        if (!user) {
            return res(Boom.badRequest('Incorrect username or email!'));
        }
        bcrypt.compare(password, user.password, function (err, isValid) {
            if (isValid) {
                return res(user);
            }
            res(Boom.badRequest('Incorrect username or email!'));
        });
    });
}


function hashPassword(password, cb) {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            return cb(err, hash);
        });
    });
}

module.exports = {
    verifyUniqueUser: verifyUniqueUser,
    verifyCredentials: verifyCredentials,
    hashPassword: hashPassword
};