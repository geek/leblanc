// Load modules

var Helpers = require('./helpers');


module.exports = {
    handler: function (request, reply) {

        var settings = JSON.stringify(this.settings);

        Helpers.commandsContext(request.server.plugins.jill, function (err, context) {

            if (err) {
                return reply(err);
            }

            context.title = 'Send Command';
            context.settings = settings;

            var options = {
                layout: 'default'
            };

            reply.view('commands', context, options);
        });
    }
};
