var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 1337
});

server.register(require('inert'), function (err) {
    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply('<img src="/google.png" />');
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{userName}',
        handler: function (request, reply) {
            reply('Hello, ' + encodeURIComponent(request.params.userName) + ' !');
        }
    });

    server.route({
        method: 'GET',
        path: '/google.png',
        handler: function (request, reply) {
            reply.file('google.png');
        }
    })

});

server.start(function () {
    console.log('Server running at: ', server.info.uri);
});