(function ($) {

    $.jill = $.jill || {};


    $.jill.init = function (settings) {

        var self = this;
        this.settings = settings;

        this._data = this._data || {};

        if (settings.logCount) {
            this.populateLogCount();
        }

        if (settings.boardSelect && settings.boardCommand) {
            settings.boardCommand.bootstrapSwitch({
                onSwitchChange: this.handleCommand.bind(this)
            });
        }

        R(function (require, module, exports) {

            var Nes = require('nes');
            self._client = new Nes.Client('ws://localhost:8080');

            self._client.connect(function (err) {

                if (err) {
                  console.error(err);
                  return;
                }

                self._client.request('boards', function (err, payload) {

                    console.log(err || payload);
                });

                self._client.subscribe('/reading', self.handleReading);
            });
        });
    };

    $.jill.handleReading = function (err, reading) {

        if (err) {
            console.error(err);
            return;
        }

        var markup = '<div class="alert alert-warning alert-dismissible" role="alert">' +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            'Board ' + reading.boardId + ' had reading of type ' + reading.type + ' and value ' + reading.value +
          '</div>';

        $('#alert').html(markup);
    };

    $.jill.handleCommand = function (event, state) {

        var boardId = this.settings.boardSelect.val();
        var addonId = this.settings.boardSelect.find(':selected').attr('data-addon');
        var request = {
            method: 'post',
            path: '/api/board/' + boardId + '/' + addonId + '/command',
            payload: {
                value: state
            }
        }
        this._client.request(request, function (err) {

            if (err) {
                console.error(err);
            }
        });
    };

    $.jill.getBoards = function (callback) {

        var self = this;

        if (this._data.boards) {
            return callback(this._data.boards);
        }

        $.getJSON(this.settings.apiUrl + '/boards', function (boards) {

            self._data.boards = boards;
            return callback(boards);
        });
    };


    $.jill.getLogs = function (callback) {

        $.getJSON(this.settings.apiUrl + '/logs', callback);
    };


    $.jill.populateLogCount = function () {

        var self = this;

        this.getLogs(function (logs) {

            var count = logs ? logs.length : 0;
            self.settings.logCount.text(count);
        });
    };


    $.jill.addonTypeNames = {
        door: 'Door sensor',
        motion: 'Motion sensor',
        smoke: 'Smoke sensor',
        light_switch: 'Light switch',
        dimmer: 'Dimmer',
        window_shade: 'Window Shade',
        temperature: 'Temperature sensor',
        humidity: 'Humidity sensor',
        barometer: 'Barometer sensor',
        wind: 'Wind sensor',
        rain: 'Rain sensor',
        uv: 'Ultraviolet sensor',
        weight: 'Weight sensor',
        power: 'Power sensor',
        heater: 'Heater',
        distance: 'Distance sensor',
        light: 'Light sensor',
        board: 'Arduino board',
        board_relay: 'Arduino relay',
        lock: 'Lock',
        ir: 'IR',
        water: 'Water sensor',
        air: 'Air sensor',
        custom: 'Custom',
        dust: 'Dust sensor',
        scene: 'Scene'
    };


    $.jill.readingTypeNames = {
        temperature: 'V_TEMP',
        humidity: 'V_HUM',
        light_switch: 'V_LIGHT',
        dimmer: 'V_DIMMER',
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
        movement: 'V_TRIPPED',
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

})(jQuery);
