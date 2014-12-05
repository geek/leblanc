(function ($) {

    $.jill = $.jill || {};

    $.jill.init = function (settings) {

        this.settings = settings;
    };

    $.jill.getRadios = function (callback) {

        $.getJSON(this.settings.apiUrl + '/radios', callback);
    };
})(jQuery);