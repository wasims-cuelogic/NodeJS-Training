'use strict';

var Boom = require('boom');
var User = require('../model/User');
var UserActivity = require('../model/UserActivity');
var authenticateUserSchema = require('../schemas/authenticateUser');
var verifyCredentials = require('../util/userFunctions').verifyCredentials;
var createToken = require('../util/token');
var requestIp = require('request-ip');

module.exports = {
    method: 'POST',
    path: '/api/users/authenticate',
    config: {
        auth: false,
        // Check the user's password against the DB
        pre: [{ method: verifyCredentials, assign: 'user' }],
        handler: function handler(req, res) {
            // If the user's password is correct, we can issue a token and store data in UserActivity collection.
            // If it was incorrect, the error will bubble up from the pre method

            var userActivity = new UserActivity();

            userActivity.ip = requestIp.getClientIp(req);
            userActivity.user_agent = req.headers['user-agent'];
            userActivity.user_id = req.pre.user._id;
            userActivity.date = Date.now();

            userActivity
                .save()
                .then(function (user) {

                    res({ id_token: createToken(req.pre.user) }).code(201);

                })
                .catch(function (err) {
                    throw Boom.badRequest(err);
                })
        },
        validate: {
            payload: authenticateUserSchema
        }
    }
};