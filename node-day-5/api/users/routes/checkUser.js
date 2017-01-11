'use strict';

var bcrypt = require('bcrypt');
var Boom = require('boom');
var User = require('../model/User');
var checkUserSchema = require('../schemas/checkUser');
var verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;

module.exports = {
    method: 'POST',
    path: '/api/users/check',
    config: {
        auth: false,
        pre: [{ method: verifyUniqueUser, assign: 'user' }],
        handler: function handler(req, res) {
            res(req.pre.user);
        },
        // Validate the payload against the Joi schema
        validate: {
            payload: checkUserSchema
        }
    }
};