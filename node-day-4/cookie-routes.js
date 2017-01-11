var Boom = require('boom')
var Bcrypt = require('bcrypt')
var Users = require('./users-db')
var Joi = require('joi')
var validator = require('validator')

var routes = [
    {
        method: 'GET',
        path: '/',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.view('profile')
                }

                reply.view('home')
            }
        }
    },
    {
        method: 'POST',
        path: '/',
        config: {
            // auth: 'session',
            auth: {
                mode: 'try'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },

            validate: {
                payload: {
                    username: Joi.string().required(),
                    password: Joi.string().required()
                },
                failAction: register_handler // register_handler is dual-purpose (see below!) 
            },
            handler: register_handler
            // handler: function (request, reply) {
            //     if (request.auth.isAuthenticated) {
            //         return reply.view('Profile')
            //     }

            //     var username = request.payload.username
            //     var user = Users[username]

            //     if (!user) {
            //         return reply(Boom.notFound('No user registered with given credentials'))
            //     }

            //     var password = request.payload.password

            //     return Bcrypt.compare(password, user.password, function (err, isValid) {
            //         if (isValid) {
            //             request.server.log('info', 'user authentication successful')
            //             request.cookieAuth.set(user);
            //             return reply.view('profile')
            //         }

            //         return reply.view('home')
            //     })
            // }
        }
    },
    {
        method: 'GET',
        path: '/logout',
        config: {
            auth: 'session',
            handler: function (request, reply) {
                request.cookieAuth.clear();
                reply.view('home')
            }
        }
    },
    {
        method: 'GET',
        path: '/payload',
        handler: function (request, reply) {
            var payload = request.payload   // <-- this is the important line

            console.log(payload)

            reply(payload)
        }
    }
]


/**
 * extract_validation_error does what its name suggests
 * given that the error is not in a very useable format we
 * need to extract it into a simple set of key:value pairs
 * @param {Object} error see: http://git.io/vcwiU
 * @returns {Object} err - the simplified error object
 */
function extract_validation_error(error) {
    var key = error.data.details[0].path;
    err = {}
    err[key] = {
        class: 'input-error',                // css class
        message: error.data.details[0].message // Joi error message
    }
    return err;
}

/**
 * return_values extracts the values the person submitted if they
 * submitted the form with incomplete or invalid data so that
 * the form is not "wiped" each time it gets valdiated!
 * @param {Object} error - see: http://git.io/vciZd
 * @returns {Object} values - key:value pairs of the fields
 * with the value sent by the client.
 */
function return_form_input_values(error) {
    var values = {};
    var keys = Object.keys(error.data._object)
    keys.forEach(function (k) {
        values[k] = validator.escape(error.data._object[k]);
    });
    return values;
}

function register_handler(request, reply, source, error) {
    // show the registration form until its submitted correctly 
    if (!request.payload || request.payload && error) {
        var errors, values; // return empty if not set. 
        if (error && error.data) { // means the handler is dual-purpose 
            errors = extract_validation_error(error); // the error field + message 
            values = return_form_input_values(error); // avoid wiping form data 
        }
        return reply.view('home', {
            title: 'Please Register ' + request.server.version,
            error: errors, // error object used in html template 
            values: values  // (escaped) values displayed in form inputs 
        }).code(error ? 400 : 200); // HTTP status code depending on error
    }
    else { // once successful, show welcome message! 

        if (request.auth.isAuthenticated) {
            return reply.view('profile', {
                name: validator.escape(request.payload.username)
            })
        }


        var username = request.payload.username
        var user = Users[username]

        if (!user) {
            return reply(Boom.notFound('No user registered with given credentials'))
        }

        var password = request.payload.password

        return Bcrypt.compare(password, user.password, function (err, isValid) {
            if (isValid) {
                request.server.log('info', 'user authentication successful')
                request.cookieAuth.set(user);
                return reply.view('profile', {
                    name: validator.escape(request.payload.username)
                })
            }

            return reply.view('home')
        })
    }
}

module.exports = routes