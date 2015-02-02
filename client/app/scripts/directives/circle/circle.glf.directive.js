(function() {
    'use strict';

    angular
        .module('app')
        .directive('glfCircle', glfCircle);

    glfCircle.$inject = ['SocketService'];

    function glfCircle(SocketService) {
        var directive = {
            restrict: 'E', // match element name
            templateUrl: 'scripts/directives/circle/circle.glf.tpl.html',
            link: link
        };
        return directive;

        /////////////////

        function link(scope, element, attrs) {
            scope.currentName = 'Kein laufender Prozess';
            scope.currentProgress = 0;
            scope.globalProgress = 0;

            /**
             * Is fired when a stats-entry is updated.
             * @param  {object} data [id of the stats-entry and all the values that have changed]
             */
            SocketService.socket.on('stats.progress.update', function(data) {

                scope.$apply(function() {
                    // update values
                    scope.currentProgress = data.progress;
                    scope.currentName = data.name;
                });

            });
        }

    }
})();