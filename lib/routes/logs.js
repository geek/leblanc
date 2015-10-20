// Load modules

var Helpers = require('./helpers');


module.exports = {
    handler: function (request, reply) {

        var settings = JSON.stringify(this.settings);

        Helpers.logsContext(request.server.plugins.jill, function (err, context) {

            if (err) {
                return reply(err);
            }

            context.title = 'All Logs';
            context.settings = settings;

            var options = {
                layout: 'default'
            };

            reply.view('logs', context, options);
        });
    }
};
