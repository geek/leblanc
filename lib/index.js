var Path = require('path');
var Handlebars = require('handlebars');


// Declare internals

var internals = {};


exports.register = function (server, options, next) {

    server.views({
        engines: {
            html: Handlebars
        },
        path: Path.join(__dirname, '../views'),
        layoutPath: Path.join(__dirname, '../views/layouts')
    });


    server.route(internals.assets);
    server.route({ path: '/{view?}', method: 'GET', config: { handler: internals.views } });

    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};


internals.assets = [
    { path: '/css/{file*}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/css') } } } },
    { path: '/font-awesome-4.1.0/{file*}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/font-awesome-4.1.0') } } } },
    { path: '/js/{file*}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/js') } } } }
];


internals.views = function (request, reply) {

    var viewName = request.params.view || 'home';
    var context = {
        title: viewName
    };

    var options = {
        layout: 'default'
    };

    reply.view(viewName, context, options);
};