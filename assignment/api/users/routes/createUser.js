'use strict';

var bcrypt = require('bcrypt');
var Boom = require('boom');
var User = require('../model/User');
var createUserSchema = require('../schemas/createUser');
var verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
var createToken = require('../util/token');

function hashPassword(password, cb) {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            return cb(err, hash);
        });
    });
}

module.exports = {
    method: 'POST',
    path: '/api/users',
    config: {
        auth: false,
        // Before the route handler runs, verify that the user is unique
        pre: [{ method: verifyUniqueUser }],
        handler: function handler(req, res) {

            var user = new User();
            user.fname = req.payload.fname;
            user.lname = req.payload.lname;
            user.email = req.payload.email;
            user.username = req.payload.username;
            user.admin = false;
            hashPassword(req.payload.password, function (err, hash) {
                if (err) {
                    throw Boom.badRequest(err);
                }
                user.password = hash;
                user.save(function (err, user) {
                    if (err) {
                        throw Boom.badRequest(err);
                    }
                    // If the user is saved successfully, issue a JWT
                    res({ id_token: createToken(user) }).code(201);
                });
            });
        },
        // Validate the payload against the Joi schema
        validate: {
            payload: createUserSchema
        }
    }
};