var Hapi = require('hapi');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hapi'
})

var server = new Hapi.Server();

server.connection({ port: 1337 });
connection.connect();

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
            if (err) throw err;

            reply('The solution is: '+rows[0].solution);
        });
    }
});

server.start(function () {
    console.log('Server is running');
});