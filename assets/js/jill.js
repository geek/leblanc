(function ($) {

    $.jill = $.jill || {};

    $.jill.init = function (settings) {

        this.settings = settings;

        this.getBoards(function (boards) {

            var count = boards ? boards.length : 0;
            settings.boardCount.text(count);
        });

        this.getLogs(function (logs) {

            var count = logs ? logs.length : 0;
            settings.logCount.text(count);
        });
    };

    $.jill.getBoards = function (callback) {

        $.getJSON(this.settings.apiUrl + '/boards', callback);
    };

    $.jill.getLogs = function (callback) {

        $.getJSON(this.settings.apiUrl + '/logs', callback);
    };
})(jQuery);