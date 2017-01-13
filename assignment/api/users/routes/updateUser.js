'use strict';

var Boom = require('boom');
var User = require('../model/User');
var updateUserSchema = require('../schemas/updateUser');
var verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;

module.exports = {
    method: 'PATCH',
    path: '/api/users/{id}',
    config: {
        pre: [{ method: verifyUniqueUser, assign: 'user' }],
        handler: function handler(req, res) {
            var id = req.params.id;

            var promise = User.findOneAndUpdate({ _id: id }, req.pre.user)
            promise.then(function (user) {

                if (!user) {
                    throw Boom.notFound('User not found!');
                }
                res({ message: 'User updated!' });

            })
                .catch(function (err) {
                    throw Boom.badRequest(err);
                })
        },
        validate: {
            payload: updateUserSchema.payloadSchema,
            params: updateUserSchema.paramsSchema
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    }

};