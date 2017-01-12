'use strict';

var User = require('../model/User');
var Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/api/users',
    config: {
        handler: function handler(req, res) {
            User.find()
                // Deselect the password and version fields
                .select('-password -__v').exec(function (err, users) {
                    if (err) {
                        throw Boom.badRequest(err);
                    }
                    if (!users.length) {
                        throw Boom.notFound('No users found!');
                    }
                    res(users);
                });
        },
        // Add authentication to this route
        // The user must have a scope of `admin`
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    }
};