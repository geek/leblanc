// Load Modules

var Path = require('path');
var Handlebars = require('handlebars');
var Hoek = require('hoek');
var Routes = require('./routes');


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

    server.bind({ settings: settings });
    server.route(Routes);

    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};
