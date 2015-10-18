var Hapi = require('hapi');
var Inert = require('inert');
var Nes = require('nes');
var Vision = require('vision');
var Jill = require('jill');
var LeBlanc = require('../');


// Declare internals

var internals = {};


internals.main = function () {

    var server = new Hapi.Server();
    server.connection({ port: 8080, labels: ['web'] });

    server.register([Inert, Vision, Nes, LeBlanc], function (err) {

        server.register(Jill, { routes: { prefix: '/api' } }, function (err) {

            if (err) {
              return internals.errorHandler(err);
            }

            server.start(function (err) {

                if (err) {
                  return internals.errorHandler(err);
                }

                console.log('Server started at http://localhost:8080')
            });
        });
    });
};


internals.errorHandler = function (err) {

    console.error(err);
    process.exit(1);
};


internals.main();
