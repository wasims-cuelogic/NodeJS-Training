var Hapi = require('hapi');
var Good = require('good');
var Vision = require('vision');
var Handlebars = require('handlebars');
var BasicAuth = require('hapi-auth-basic');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 1337
});

server.register([
    {
        register: require('inert')
    },
    {
        register: require('./base-route')
    },
    {
        register: Vision
    },
    {
        register: Good,
        options: {
            ops: {
                interval: 10000
            },
            reporters: {
                myConsoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*', request: '*' }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        }

    }
], function (err) {

    if (err) {
        server.log('info', 'Failed to install plugins')

        throw err
    }

    server.log('info', 'Plugins registered')

    /**
     * View Configuration
     */

    server.views({
        engines: {
            html: Handlebars
        },
        path: __dirname + '/views',
        layout: false
    })

    server.log('info', 'View configuration completed')

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            var data = { message: 'Hello from Future Studio' }
            reply.view('index', data)
        }
    })

    server.log('info', 'Route registered')

    //Start the server
    server.start(function (err) {
        if (err) {

            server.log('error', 'Failed to start server');

            throw err;
        }

        server.log('info', 'Server started at ' + server.info.uri);

    })
});

