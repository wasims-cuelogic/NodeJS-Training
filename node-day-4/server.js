var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server();

server.connection({
    port: 1337
});

server.register(require('vision'), function (err) {

    if(err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index', {name: 'John'});
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{userName}',
        handler: function (request, reply) {
            var name = encodeURIComponent(request.params.userName);
            reply.view('user', {name: name});
        }
    });

    server.views({
        engines:{
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    })
});

server.start(function () {
    console.log('Server running at: ', server.info.uri);
});