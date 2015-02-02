(function() {

    'use strict';

    angular
        .module('app')
        .filter('glfScale', glfScale);

    /**
     * Filter for converting ffmpeg scale values into human readable values
     */
    function glfScale() {
        return function(factor) {
            if(factor === 'scale=-1:-1') {
                return 'Untouched';
            }
            else if(factor === 'scale=-1:1080') {
                return '1080p';
            }
            else if(factor === 'scale=-1:720') {
                return '720p';
            }
            else if(factor === 'scale=-1:480') {
                return '480p';
            }
            else if(factor === 'scale=-1:360') {
                return '360p';
            }
            else {
                return '-'
            }
        };
    }


})();