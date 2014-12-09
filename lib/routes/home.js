// Load modules

var Helpers = require('./helpers');


module.exports = {
    handler: function (request, reply) {

        var settings = JSON.stringify(this.settings);

        Helpers.populateContext(request.server.plugins.jill, function (err, context) {

            if (err) {
                return reply(err);
            }

            context.title = 'Dashboard';
            context.settings = settings;

            var options = {
                layout: 'default'
            };

            reply.view('home', context, options);
        });
    }
};