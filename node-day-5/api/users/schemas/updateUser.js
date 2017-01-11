'use strict';

var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

var payloadSchema = Joi.object({
    username: Joi.string().alphanum().min(2).max(30),
    email: Joi.string().email(),
    admin: Joi.boolean()
});

var paramsSchema = Joi.object({
    id: Joi.objectId().required()
});

module.exports = {
    payloadSchema: payloadSchema,
    paramsSchema: paramsSchema
};