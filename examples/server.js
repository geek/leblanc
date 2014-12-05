var Hapi = require('hapi');
var LeBlanc = require('../');


// Declare internals

var internals = {};


internals.main = function () {

    var server = new Hapi.Server();
    server.connection({ port: 8080 });
    server.register(LeBlanc, internals.errorHandler);
    server.start(internals.errorHandler);
};


internals.errorHandler = function (err) {

    if (err) {
        console.error(err);
    }

};


internals.main();
