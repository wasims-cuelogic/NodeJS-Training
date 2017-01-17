'use strict';

var userController = require('../controllers/user');

module.exports = {
    method: 'POST',
    path: '/api/users',
    config: userController.createUser
};