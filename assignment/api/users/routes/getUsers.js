'use strict';

var User = require('../model/User');
var Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/api/users',
    config: {
        handler: function handler(request, reply) {
            User.find()
                // Deselect the password and version fields
                .select('-password -__v')
                .exec()
                .then(function (users) {
                    if (!users.length) {
                        throw Boom.notFound('No users found!');
                    }
                    reply(users);
                })
                .catch(function (err) {
                    throw Boom.badRequest(err);
                })
        },
        // Add authentication to this route
        // The user must have a scope of `admin`
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    }
};