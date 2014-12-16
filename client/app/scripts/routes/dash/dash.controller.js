(function () {

    'use strict';

    angular
        .module('app')
        .controller('DashCtrl', DashCtrl);

    DashCtrl.$inject = ['SocketService', 'AuthService','$state'];

    /**
     * Handles the dash-board view and all interactions
     */
    function DashCtrl(SocketService, AuthService, $state) {
        var ctrl = this;

        /**
         * Starts the logout process and redirects to the login.
         */
        function submitLogout() {
            AuthService.logout();
            $state.go('login');
        }

        //////////////////////

        angular.extend(ctrl, {
            currentProgress: 0,
            currentName: 'Kein laufender Prozess',
            currentUser: AuthService.getUserName(),
            globalProgress: 0,
            isAdmin: false,

            submitLogout: submitLogout
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