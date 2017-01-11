'use strict';

var Hapi = require('hapi');
var Boom = require('boom');
var mongoose = require('mongoose');
var glob = require('glob');
var path = require('path');
var secret = require('./config');

var server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ host: 'localhost', port: 3000, routes: { cors: true } });

var dbUrl = 'mongodb://localhost:27017/hapi-app';

server.register(require('hapi-auth-jwt'), function (err) {

    // We're giving the strategy both a name
    // and scheme of 'jwt'
    server.auth.strategy('jwt', 'jwt', 'required', {
        key: secret,
        verifyOptions: { algorithms: ['HS256'] }
    });

    // Look through the routes in
    // all the subdirectories of API
    // and create a new route for each
    glob.sync('api/**/routes/*.js', {
        root: __dirname
    }).forEach(function (file) {
        var route = require(path.join(__dirname, file));
        server.route(route);
    });
});

var options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }]
    }
};

server.register({
    register: require('good'),
    options: options
}, function (err) {

    if (err) {
        return console.error(err);
    }
    server.start(function () {
        if (err) {
            throw err;
        }

        // Once started, connect to Mongo through Mongoose
        mongoose.connect(dbUrl, {}, function (err) {
            if (err) {
                throw err;
            }
        });
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});