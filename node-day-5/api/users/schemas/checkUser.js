'use strict';

var Joi = require('joi');

var checkUserSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string()
});

module.exports = checkUserSchema;