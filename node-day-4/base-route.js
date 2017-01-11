var baseRoutes = {
    register: function (server, options, next) {
        var routes = [
            // {
            //     method: 'GET',
            //     path: '/{identifier?}',
            //     handler: function (request, reply) {
            //         reply('Hello ' + encodeURIComponent(request.params.identifier))
            //     }
            // },
            {
                method: ['POST', 'PUT'],
                path: '/',
                handler: function (request, reply) {
                    reply('Hey')
                }
            },
            {
                method: 'GET',
                path: '/page/{page*}',
                handler: function (request, reply) {
                    var page = request.params.page || 1
                    reply('Greetings: ' + encodeURIComponent(page))
                },
                config: {
                    description: 'Sends a friendly greeting!',
                    notes: 'No route parameters available',
                    tags: ['greeting']
                }
            },
            {
                method: 'GET',
                path: '/response',
                handler: function (request, reply) {
                    var data = {
                        key: 'value',
                        another: false,
                        number: 10,
                        func: function () {
                            return this.number * 10
                        }
                    }

                    reply(data)
                }
            }
        ]

        server.route(routes)
        next()
    }
}

baseRoutes.register.attributes = {
    name: 'base-routes',
    version: '1.0.0'
}

module.exports = baseRoutes;