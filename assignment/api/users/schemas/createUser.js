'use strict';

var Joi = require('joi');

var createUserSchema = Joi.object({
    fname: Joi.string().alphanum().min(2).max(30),
    lname: Joi.string().alphanum().min(2).max(30),
    username: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().email(),
    password: Joi.string().required()
});

module.exports = createUserSchema;