// Load Modules

var Path = require('path');
var Handlebars = require('handlebars');
var Hoek = require('hoek');


// Declare internals

var internals = {
    defaults: {
        apiUrl: 'http://localhost:15301'
    }
};


exports.register = function (server, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options || {});

    server.views({
        engines: {
            html: Handlebars
        },
        path: Path.join(__dirname, '../views'),
        layoutPath: Path.join(__dirname, '../views/layouts')
    });


    server.route(internals.assets);
    server.route({ path: '/{view?}', method: 'GET', config: { handler: internals.views(settings) } });

    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};


internals.assets = [
    { path: '/3rd-party/{file*}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/3rd-party') } } } },
    { path: '/js/{file*1}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/js') } } } }
];


internals.views = function (settings) {

    return function (request, reply) {

        var viewName = request.params.view || 'home';
        var context = {
            title: viewName,
            settings: JSON.stringify(settings)
        };

        var options = {
            layout: 'default'
        };

        reply.view(viewName, context, options);
    };
};