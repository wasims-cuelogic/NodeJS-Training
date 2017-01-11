'use strict';

var Joi = require('joi');

var createUserSchema = Joi.object({
    fname: Joi.string().alphanum().min(2).max(30).required(),
    lname: Joi.string().alphanum().min(2).max(30).required(),
    username: Joi.string().alphanum().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = createUserSchema;