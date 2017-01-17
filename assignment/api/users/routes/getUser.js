'use strict';

var userController = require('../controllers/user');

module.exports = {
    method: 'GET',
    path: '/api/users/{id}',
    config: userController.getUser
};