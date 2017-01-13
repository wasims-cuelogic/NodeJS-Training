'use strict';

var User = require('../model/User');
var Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/api/users/{id}',
    config: {

        handler: function handler(request, reply) {
                User.find({
                    _id: request.params.id
                })
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
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    }
};