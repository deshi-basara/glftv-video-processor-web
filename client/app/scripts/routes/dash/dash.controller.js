(function () {

    'use strict';

    angular
        .module('app')
        .controller('DashCtrl', DashCtrl);

    DashCtrl.$inject = ['SocketService'];

    /**
     * Handles the dash-board view and all interactions
     */
    function DashCtrl(SocketService) {
        var ctrl = this;


        //////////////////////

        angular.extend(ctrl, {
            currentProgress: 0,
            currentName: 'Kein laufender Prozess',
            currentUser: 'Ada Rhode',
            globalProgress: 0,
            isAdmin: false
        });

        /////////////////////

        /**
         * Is fired when a stats-entry is updated.
         * @param  {object} data [id of the stats-entry and all the values that have changed]
         */
        SocketService.socket.on('stats.progress.update', function(data) {

            // update values
            ctrl.currentProgress = data.progress;
            ctrl.currentName = data.name;

        });

    }

})();