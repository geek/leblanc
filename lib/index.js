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

    server.bind({ settings: settings });
    server.route(internals.assets);
    server.route({ path: '/', method: 'GET', config: { handler: internals.home } });
    server.route({ path: '/board/{boardId}', method: 'GET', config: { handler: internals.board } });

    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};


internals.assets = [
    { path: '/3rd-party/{file*}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/3rd-party') } } } },
    { path: '/css/{file*1}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/css') } } } },
    { path: '/js/{file*1}', method: 'GET', config: { handler: { directory: { path: Path.join(__dirname, '../', '/assets/js') } } } }
];


internals.home = function (request, reply) {

    var settings = JSON.stringify(this.settings);

    internals.populateContext(request.server.plugins.jill, function (err, context) {

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
};


internals.board = function (request, reply) {

    var context = {
        title: 'Board',
        settings: JSON.stringify(settings),
        readings: [
            {
                type: 'bolt',
                title: 'Movement detected',
                time: new Date().toString()
            }
        ]
    };

    var options = {
        layout: 'default'
    };

    reply.view('board', context, options);
};


internals.populateContext = function (jill, callback) {

    jill.getBoards(function (err, boards) {

        if (err) {
            return callback(err);
        }

        var friendlyBoards = [];
        var allReadings = [];

        for (var i = 0, il = boards.length; i < il; ++i) {
            var board = boards[i];
            var addonKeys = board.addons ? Object.keys(board.addons) : [];
            friendlyBoards.push({
                id: board.id,
                name: board.name || ('Board ' + board.id),
                addonCount: addonKeys.length - 1
            });

            allReadings = allReadings.concat(internals.boardReadings(board));
        }

        allReadings.sort(function (reading1, reading2) {

            if (reading1.time < reading2.time) {
                return -1;
            }
            if (reading1.time > reading2.time) {
                return 1;
            }

            return 0;
        });

        var readings = internals.convertToFriendlyReadings(allReadings.slice(0, 15));

        var context = {
            boards: friendlyBoards,
            boardCount: boards.length,
            readings: readings
        };

        return callback(null, context);
    });
};


internals.boardReadings = function (board) {

    var readings = [];
    var addonKeys = board.addons ? Object.keys(board.addons) : [];
    for (var i = 0, il = addonKeys.length; i < il; ++i) {
        var addonKey = addonKeys[i];
        if (addonKey !== '255') {           // Arduino ID
            readings = readings.concat(board.addons[addonKey].readings);
        }
    }

    return readings;
};


internals.convertToFriendlyReadings = function (readings) {

    var now = Date.now();

    var friendlyReadings = [];
    for (var i = 0, il = readings.length; i < il; ++i) {
        var reading = readings[i];
        var formatter = internals.readingFormatters[reading.type];
        friendlyReadings.push({
            type: reading.type,
            time: now - reading.time + ' ms ago',
            title: formatter ? formatter(reading.value) : reading.value
        });
    }

    return friendlyReadings;
};


internals.readingFormatters = {
    temperature: function (value) {

        return value + ' degrees';
    },
    humidity: function (value) {

        return value + ' degrees';
    },
    light_switch: 'Light',
    dimmer: 'Dimmer',
    pressure: 'V_PRESSURE',
    weather_forecast: 'V_FORECAST',
    rain_amount: 'V_RAIN',
    rain_rate: 'V_RAINRATE',
    wind_speed: 'V_WIND',
    wind_gust: 'V_GUST',
    wind_direction: 'V_DIRECTION',
    uv: 'V_UV',
    weight: 'V_WEIGHT',
    distance: 'V_DISTANCE',
    impedance: 'V_IMPEDANCE',
    armed: 'V_ARMED',
    movement: function (value) {

        return value === true ? 'Motion detected' : 'Motion stopped'
    },
    watt: 'V_WATT',
    kmh: 'V_KWH',
    scene_on: 'V_SCENE_ON',
    scene_off: 'V_SCENE_OFF',
    heater: 'V_HEATER',
    heater_switch: 'V_HEATER_SW',
    light_level: 'V_LIGHT_LEVEL',
    custom1: 'V_VAR1',
    custom2: 'V_VAR2',
    custom3: 'V_VAR3',
    custom4: 'V_VAR4',
    custom5: 'V_VAR5',
    window_shade_up: 'V_UP',
    window_shade_down: 'V_DOWN',
    window_shade_stop: 'V_STOP',
    ir_send: 'V_IR_SEND',
    ir_receive: 'V_IR_RECEIVE',
    water_flow: 'V_FLOW',
    volume: 'V_VOLUME',
    lock: 'V_LOCK_STATUS',
    dust_level: 'V_DUST_LEVEL',
    voltage: 'V_VOLTAGE',
    current: 'V_CURRENT'
};
