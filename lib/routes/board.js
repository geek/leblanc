// Load modules

var Joi = require('joi');
var Helpers = require('./helpers');


module.exports = {
    validate: {
        params: {
            id: Joi.number()
        }
    },
    handler: function (request, reply) {

        var settings = JSON.stringify(this.settings);

        Helpers.boardContext(request.params.id, request.server.plugins.jill, function (err, context) {

            if (err) {
                return reply(err);
            }

            context.title = 'Board ' + request.params.id;
            context.settings = settings;

            var options = {
                layout: 'default'
            };

            reply.view('board', context, options);
        });
    }
};
