import Hapi from 'hapi';

const server = new Hapi.Server();

const config = {
    host: "127.0.0.1",
    port: "9000",
    username: "wasim.sayyed"
};

server.connection({
    port: 8000
});

server.route({

    method: 'GET',
    path: '/hello',
    handler: (request, reply) => {
        reply('Hello World!');
    }
});

server.start(err => {

    if (err) {

        // Fancy error handling here
        console.error('Error was handled!');
        console.error(err);

    }

    console.log(`Server started at ${server.info.uri}`);

});