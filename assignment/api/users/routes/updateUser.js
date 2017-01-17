'use strict';

var userController = require('../controllers/user');

module.exports = {
    method: 'PATCH',
    path: '/api/users/{id}',
    config: userController.updateUser
};