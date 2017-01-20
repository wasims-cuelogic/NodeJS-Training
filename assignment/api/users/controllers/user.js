"use strict";

var Boom = require('boom'),
    User = require('../model/User'),
    UserActivity = require('../model/UserActivity'),
    hashPassword = require('../util/userFunctions').hashPassword,
    createToken = require('../util/token'),
    requestIp = require('request-ip'),
    Bluebird = require('bluebird'),
    _ = require('lodash');

require('dotenv').config();

function UserController() { };
UserController.prototype = (function () {

    return {
        authenticate: function (request, reply) {
            // If the user's password is correct, we can issue a token and store data in UserActivity collection.
            // If it was incorrect, the error will bubble up from the pre method

            var userActivity = new UserActivity();

            userActivity.ip = requestIp.getClientIp(request);
            userActivity.user_agent = request.headers['user-agent'];
            userActivity.user_id = request.pre.user._id;
            userActivity.date = Date.now();

            var deleteActivity = UserActivity.remove({ user_id: request.pre.user._id });

            deleteActivity.then(function () {
                return userActivity.save(); // returns a promise
            })
                .then(function (user) {
                    reply({ id_token: createToken(request.pre.user) }).code(201);
                })
                .catch(function (err) {
                    throw Boom.badRequest(err);
                })
        },
        createUser: function (request, reply) {

            var user = new User();

            user.fname = request.payload.fname;
            user.lname = request.payload.lname;
            user.email = request.payload.email;
            user.username = request.payload.username;
            user.admin = false;
            hashPassword(request.payload.password, function (err, hash) {

                if (err) {
                    throw Boom.badRequest(err);
                }
                user.password = hash;
                user.save()
                    .then(function (user) {
                        console.log("User ", user)

                        //Added code to insert in activity collection
                        var userActivity = new UserActivity();

                        userActivity.ip = requestIp.getClientIp(request);
                        userActivity.user_agent = request.headers['user-agent'];
                        userActivity.user_id = user._id;
                        userActivity.date = Date.now();

                        var deleteActivity = UserActivity.remove({ user_id: user._id });

                        deleteActivity.then(function () {
                            return userActivity.save(); // returns a promise
                        })


                        reply({ id_token: createToken(user) }).code(201);
                    })
                    .catch(function (err) {
                        console.log(err)
                        var errMessage = {};

                        _.each(err.errors, function (error, key) {
                            errMessage[key] = error.message;
                        });

                        //console.log(errMessage)
                        // throw Boom.badRequest('Invalid format of user id');
                        //throw Boom.badRequest(fnameErrMsg);
                        reply(errMessage).code(400);
                    })
            });
        },
        // authenticate: {
        //     auth: false,
        //     // Check the user's password against the DB
        //     pre: [{ method: verifyCredentials, assign: 'user' }],
        //     handler: function authenticate(request, reply) {

        //         // If the user's password is correct, we can issue a token and store data in UserActivity collection.
        //         // If it was incorrect, the error will bubble up from the pre method

        //         var userActivity = new UserActivity();

        //         userActivity.ip = requestIp.getClientIp(request);
        //         userActivity.user_agent = request.headers['user-agent'];
        //         userActivity.user_id = request.pre.user._id;
        //         userActivity.date = Date.now();

        //         var deleteActivity = UserActivity.remove({ user_id: request.pre.user._id });

        //         deleteActivity.then(function () {
        //             return userActivity.save(); // returns a promise
        //         })
        //             .then(function (user) {
        //                 reply({ id_token: createToken(request.pre.user) }).code(201);
        //             })
        //             .catch(function (err) {
        //                 throw Boom.badRequest(err);
        //             })
        //     },
        //     validate: {
        //         failAction: Relish.options({
        //             messages: {
        //                 'username': 'Please enter username',
        //                 'password': 'Please enter password'
        //             }
        //         }).failAction,
        //         payload: authenticateUserSchema
        //     }
        // },
        // createUser: {
        //     auth: false,
        //     // Before the route handler runs, verify that the user is unique
        //     // pre: [{ method: verifyUniqueUser }],
        //     handler: function handler(req, res) {

        //         var user = new User();

        //         user.fname = req.payload.fname;
        //         user.lname = req.payload.lname;
        //         user.email = req.payload.email;
        //         user.username = req.payload.username;
        //         user.admin = false;
        //         hashPassword(req.payload.password, function (err, hash) {

        //             if (err) {
        //                 throw Boom.badRequest(err);
        //             }
        //             user.password = hash;
        //             user.save()
        //                 .then(function (user) {

        //                     //Added code to insert in activity collection
        //                     var userActivity = new UserActivity();

        //                     userActivity.ip = requestIp.getClientIp(req);
        //                     userActivity.user_agent = req.headers['user-agent'];
        //                     userActivity.user_id = user._id;
        //                     userActivity.date = Date.now();

        //                     var deleteActivity = UserActivity.remove({ user_id: user._id });

        //                     deleteActivity.then(function () {
        //                         return userActivity.save(); // returns a promise
        //                     })


        //                     res({ id_token: createToken(user) }).code(201);
        //                 })
        //                 .catch(function (err) {
        //                     //console.log(errMessage) 
        //                     var errMessage = {};

        //                     _.each(err.errors, function (error, key) {
        //                         errMessage[key] = error.message;
        //                     });

        //                     console.log(errMessage)
        //                     // throw Boom.badRequest('Invalid format of user id');
        //                     //throw Boom.badRequest(fnameErrMsg);
        //                     res(errMessage).code(400);
        //                 })
        //         });
        //     },
        //     // Validate the payload against the Joi schema
        //     validate: {
        //         // failAction: Relish.failAction,
        //         // payload: createUserSchema
        //     }
        // },
        // getUser: {
        //     handler: function handler(request, reply) {
        //         User.find({
        //             _id: request.params.id
        //         })
        //             // Deselect the password and version fields
        //             .select('-password -__v')
        //             .exec()
        //             .then(function (users) {
        //                 if (!users.length) {
        //                     throw Boom.notFound('No users found!');
        //                 }
        //                 reply(users);
        //             })
        //             .catch(function (err) {
        //                 if (err.name === 'CastError') {
        //                     throw Boom.badRequest('Invalid format of user id');
        //                 }
        //                 else {
        //                     throw Boom.badRequest(err);
        //                 }

        //             })
        //     },
        //     auth: {
        //         strategy: 'jwt',
        //         scope: ['admin']
        //     }
        // },
        getUser: function handler(request, reply) {
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
                    if (err.name === 'CastError') {
                        throw Boom.badRequest('Invalid format of user id');
                    }
                    else {
                        throw Boom.badRequest(err);
                    }

                })
        },
        // getUsers: {
        //     handler: function handler(request, reply) {
        //         User.find()
        //             // Deselect the password and version fields
        //             .select('-password -__v')
        //             .exec()
        //             .then(function (users) {
        //                 if (!users.length) {
        //                     throw Boom.notFound('No users found!');
        //                 }
        //                 reply(users);
        //             })
        //             .catch(function (err) {
        //                 throw Boom.badRequest(err);
        //             })
        //     },
        //     // Add authentication to this route
        //     // The user must have a scope of `admin`
        //     auth: {
        //         strategy: 'jwt',
        //         scope: ['admin']
        //     }
        // },
        getUsers: function handler(request, reply) {
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
        updateUser: function handler(req, res) {

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
        // updateUser: {
        //     pre: [{ method: verifyUniqueUser, assign: 'user' }],
        //     handler: function handler(req, res) {
        //         var id = req.params.id;

        //         var promise = User.findOneAndUpdate({ _id: id }, req.pre.user)
        //         promise.then(function (user) {

        //             if (!user) {
        //                 throw Boom.notFound('User not found!');
        //             }
        //             res({ message: 'User updated!' });

        //         })
        //             .catch(function (err) {
        //                 throw Boom.badRequest(err);
        //             })
        //     },
        //     validate: {
        //         failAction: Relish.failAction,
        //         payload: updateUserSchema.payloadSchema,
        //         params: updateUserSchema.paramsSchema
        //     },
        //     auth: {
        //         strategy: 'jwt',
        //         scope: ['admin']
        //     }
        // },
        // checkUser: {
        //     auth: false,
        //     pre: [{ method: verifyUniqueUser, assign: 'user' }],
        //     handler: function handler(req, res) {
        //         res(req.pre.user);
        //     },
        //     // Validate the payload against the Joi schema
        //     validate: {
        //         payload: checkUserSchema
        //     }
        // },
        checkUser: function handler(request, reply) {
            res(request.pre.user);
        },
        // getUsersNotLoggedIn: {
        //     handler: function handler(request, reply) {
        //         UserActivity.find({
        //             "date":
        //             {
        //                 $lte: (new Date((new Date()).getTime() - (process.env.NOT_LOGGED_IN_DAYS * 24 * 60 * 60 * 1000)))
        //             }
        //         })
        //             .populate('user_id')
        //             .exec(function (err, users) {

        //                 if (err) {
        //                     throw Boom.badRequest(err);
        //                 }
        //                 if (!users.length) {
        //                     throw Boom.notFound('No users found!');
        //                 }

        //                 reply(users);


        //             });
        //         // UserActivity.find({
        //         //     "date":
        //         //     {
        //         //         $lte: (new Date((new Date()).getTime() - (process.env.NOT_LOGGED_IN_DAYS * 24 * 60 * 60 * 1000)))
        //         //     }
        //         // })
        //         //     .select({ user_id: 1, _id: 0 })
        //         //     .sort({ "date": -1 })
        //         //     .exec(function (err, users) {
        //         //         if (err) {
        //         //             throw Boom.badRequest(err);
        //         //         }
        //         //         if (!users.length) {
        //         //             throw Boom.notFound('No users found!');
        //         //         }

        //         //         var usersIds = [];

        //         //         users.map((val) => {
        //         //             usersIds.push(val["user_id"]);
        //         //         });

        //         //         User
        //         //             .find({ _id: { $in: usersIds } })
        //         //             .select('-password -__v')
        //         //             .exec(function (err, usersLits) {
        //         //                 reply(usersLits);
        //         //             });
        //         //     });
        //     },
        //     auth: {
        //         strategy: 'jwt',
        //         scope: ['admin']
        //     }
        // },
        getUsersNotLoggedIn: function (request, reply) {
            UserActivity.find({
                "date":
                {
                    $lte: (new Date((new Date()).getTime() - (process.env.NOT_LOGGED_IN_DAYS * 24 * 60 * 60 * 1000)))
                }
            })
                .populate('user_id')
                .exec(function (err, users) {

                    if (err) {
                        throw Boom.badRequest(err);
                    }
                    if (!users.length) {
                        throw Boom.notFound('No users found!');
                    }

                    reply(users);
                });
        }
    }
})();

var userController = new UserController();
module.exports = userController;