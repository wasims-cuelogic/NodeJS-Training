'use strict';

var User = require('../model/User');
var UserActivity = require('../model/UserActivity');
var Boom = require('boom');
var Bluebird = require('bluebird');
require('dotenv').config();


module.exports = {
    method: 'GET',
    path: '/api/users/notloggedin',
    config: {
        handler: function handler(request, reply) {
            UserActivity.find({
                "date":
                {
                    $lte: (new Date((new Date()).getTime() - (process.env.NOT_LOGGED_IN_DAYS * 24 * 60 * 60 * 1000)))
                }
            })
                .select({ user_id: 1, _id: 0 })
                .sort({ "date": -1 })
                .exec(function (err, users) {
                    if (err) {
                        throw Boom.badRequest(err);
                    }
                    if (!users.length) {
                        throw Boom.notFound('No users found!');
                    }

                    var usersIds = [];

                    users.map((val) => {
                        usersIds.push(val["user_id"]);
                    });

                    User
                        .find({ _id: { $in: usersIds } })
                        .select('-password -__v')
                        .exec(function (err, usersLits) {
                            reply(usersLits);
                        });
                });
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    }
};