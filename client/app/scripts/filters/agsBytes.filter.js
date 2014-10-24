(function() {

    'use strict';

    angular
        .module('app')
        .filter('agsBytes', agsBytes);

    /**
     * Filter for converting bytes in a more understandable unit
     * https://github.com/niemyjski/angular-filters/blob/master/src/bytes/bytes-filter.js
     */
    function agsBytes() {
        return function(bytes, precision) {
            if (bytes === 0) {
                return '0 B';
            }

            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '-';
            }

            var isNegative = bytes < 0;
            if (isNegative) {
                bytes = -bytes;
            }

            if (typeof precision === 'undefined') {
                precision = 1;
            }

            var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
            var number = (bytes / Math.pow(1024, Math.floor(exponent))).toFixed(precision);

            return (isNegative ? '-' : '') +  number +  ' ' + units[exponent];
        };
    }


})();