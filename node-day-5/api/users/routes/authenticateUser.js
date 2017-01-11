'use strict';

var Boom = require('boom');
var User = require('../model/User');
var authenticateUserSchema = require('../schemas/authenticateUser');
var verifyCredentials = require('../util/userFunctions').verifyCredentials;
var createToken = require('../util/token');

module.exports = {
    method: 'POST',
    path: '/api/users/authenticate',
    config: {
        auth: false,
        // Check the user's password against the DB
        pre: [{ method: verifyCredentials, assign: 'user' }],
        handler: function handler(req, res) {
            // If the user's password is correct, we can issue a token.
            // If it was incorrect, the error will bubble up from the pre method
            res({ id_token: createToken(req.pre.user) }).code(201);
        },
        validate: {
            payload: authenticateUserSchema
        }
    }
};