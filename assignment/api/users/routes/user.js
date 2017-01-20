'use strict';

var userController = require('../controllers/user'),
    verifyCredentials = require('../util/userFunctions').verifyCredentials,
    authenticateUserSchema = require('../schemas/authenticateUser'),
    createUserSchema = require('../schemas/createUser'),
    updateUserSchema = require('../schemas/updateUser'),
    verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser,
    checkUserSchema = require('../schemas/checkUser'),

    Relish = require('relish')({
        stripQuotes: true
    });

module.exports = [
    {
        method: 'POST',
        path: '/api/users/authenticate',
        config: {
            auth: false,
            // Check the user's password against the DB
            pre: [{ method: verifyCredentials, assign: 'user' }],
            validate: {
                failAction: Relish.options({
                    messages: {
                        'username': 'Please enter username',
                        'password': 'Please enter password'
                    }
                }).failAction,
                payload: authenticateUserSchema
            }
        },
        handler: userController.authenticate
    },
    {
        method: 'POST',
        path: '/api/users',
        config: {
            auth: false,
            // Before the route handler runs, verify that the user is unique
            pre: [{ method: verifyUniqueUser }],
            validate: {
                // failAction: Relish.failAction,
                // payload: createUserSchema
            }
        },
        handler: userController.createUser
    },
    {
        method: 'GET',
        path: '/api/users/{id}',
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }
        },
        handler: userController.getUser
    },
    {
        method: 'GET',
        path: '/api/users',
        config: {
            // Add authentication to this route
            // The user must have a scope of `admin`
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }
        },
        handler: userController.getUsers
    },
    {
        method: 'PATCH',
        path: '/api/users/{id}',
        config: {
            pre: [{ method: verifyUniqueUser, assign: 'user' }],
            validate: {
                failAction: Relish.failAction,
                payload: updateUserSchema.payloadSchema,
                params: updateUserSchema.paramsSchema
            },
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }
        },
        handler: userController.updateUser
    },
    {
        method: 'POST',
        path: '/api/users/check',
        config: {
            auth: false,
            pre: [{ method: verifyUniqueUser, assign: 'user' }],
            validate: {
                payload: checkUserSchema
            }
        },
        handler: userController.checkUser
    },
    {
        method: 'GET',
        path: '/api/users/notloggedin',
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            }
        },
        handler: userController.getUsersNotLoggedIn
    }
];